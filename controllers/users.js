const bcrypt = require('bcryptjs');

const User = require('../models/users');
const Post = require('../models/posts');
const { generateSendJWT } = require('../service/auth');
const successHandle = require('../service/successHandle');
const appError = require('../service/appError');
const checkBodyRequired = require('../tools/checkBodyRequired');
const checkObjectId = require('../tools/checkObjectId');
const customizeValidator = require('../tools/customizeValidator');

const bcryptSalt = 12;

const users = {
  async signUp(req, res, next) {
    const data = req.body;

    const requireds = ['name', 'email', 'password'];
    const bodyResultIsPass = checkBodyRequired(
      requireds,
      req.method,
      data,
      next
    );

    if (bodyResultIsPass) {
      customizeValidator.email(data.email, next);
      customizeValidator.password(data.password, next);
      customizeValidator.name(data.name, next);

      // 密碼加密
      password = await bcrypt.hash(data.password, bcryptSalt);
      const newUser = await User.create({
        name: data.name,
        email: data.email,
        password: password
      });

      generateSendJWT(res, newUser);
    }
  },
  async signIn(req, res, next) {
    const data = req.body;

    const requireds = ['email', 'password'];
    const bodyResultIsPass = checkBodyRequired(
      requireds,
      req.method,
      data,
      next
    );

    if (bodyResultIsPass) {
      customizeValidator.email(data.email, next);

      // password 欄位在 schema 設定為不顯示，使用 select() 顯示密碼
      const user = await User.findOne({ email: data.email }).select(
        '+password'
      );

      if (user) {
        // 比較密碼(body & DB)是否一致
        const auth = await bcrypt.compare(data.password, user.password);
        if (!auth) {
          return next(appError(400, 'signIn', next));
        }

        generateSendJWT(res, user);
      } else {
        return next(appError(400, 'memberNotExist', next));
      }
    }
  },
  async updatePassword(req, res, next) {
    const data = req.body;

    const requireds = ['newPassword', 'confirmPassword'];
    const bodyResultIsPass = checkBodyRequired(
      requireds,
      req.method,
      data,
      next
    );

    if (bodyResultIsPass) {
      customizeValidator.passwordIdentical(
        data.newPassword,
        data.confirmPassword,
        next
      );

      customizeValidator.password(data.newPassword, next);

      newPassword = await bcrypt.hash(data.newPassword, bcryptSalt);
      await User.findByIdAndUpdate(req.user.id, {
        password: newPassword
      });

      successHandle(res, []);
    }
  },
  async getProfile(req, res, next) {
    const user = await User.findById(req.user.id);
    if (user) {
      successHandle(res, user);
    } else {
      return next(appError(400, 'memberNotExist', next));
    }
  },
  async updateProfile(req, res, next) {
    const data = req.body;

    const requireds = ['name'];
    const bodyResultIsPass = checkBodyRequired(
      requireds,
      req.method,
      data,
      next
    );

    if (bodyResultIsPass) {
      customizeValidator.name(data.name, next);
      customizeValidator.sex(data.sex, next);

      await User.findByIdAndUpdate(req.user.id, data, {
        new: true,
        runValidators: true
      }).then((update) => {
        if (update) {
          generateSendJWT(res, update);
        } else {
          return next(appError(400, 'memberNotExist', next));
        }
      });
    }
  },
  async addFollow(req, res, next) {
    const followersId = req.params.id;
    const followingId = req.user.id;

    // 不能追蹤自己
    if (followersId === followingId) {
      return next(appError(400, 'followingOwn', next));
    }

    checkObjectId.format(followersId, next);
    const user = await checkObjectId.findById('User', followersId, next);
    if (user) {
      // 更新到追隨者
      await User.updateOne(
        {
          _id: followingId,
          'following.user': { $ne: followersId }
        },
        {
          $addToSet: { following: { user: followersId } }
        }
      );

      // 更新到跟隨者
      await User.updateOne(
        {
          _id: followersId,
          'followers.user': { $ne: followingId }
        },
        {
          $addToSet: { followers: { user: followingId } }
        }
      );

      const followers = await User.findById(followersId);
      successHandle(res, followers);
    }
  },
  async unfollow(req, res, next) {
    const followersId = req.params.id;
    const followingId = req.user.id;

    // 不能移除跟隨自己
    if (followersId === followingId) {
      return next(appError(400, 'unfollowingOwn', next));
    }

    checkObjectId.format(followersId, next);
    const user = await checkObjectId.findById('User', followersId, next);

    if (user) {
      // 更新到追隨者
      await User.updateOne(
        {
          _id: followingId
        },
        {
          $pull: { following: { user: followersId } }
        }
      );

      // 更新到跟隨者
      await User.updateOne(
        {
          _id: followersId
        },
        {
          $pull: { followers: { user: followingId } }
        }
      );

      const followers = await User.findById(followersId);
      successHandle(res, followers);
    }
  },
  async getLikeList(req, res, next) {
    const likeList = await Post.find({
      likes: { $in: [req.user.id] }
    })
      .sort('-createdAt')
      .populate({
        path: 'user',
        select: '_id name photo'
      });

    successHandle(res, likeList);
  },
  async myFollowing(req, res, next) {
    await User.findById(req.user.id).then(async (user) => {
      const newFollowing = [];
      if (user.following.length) {
        await user.following.forEach(async (item, index) => {
          item.user = await User.findById(item.user).select('name photo');
          newFollowing.push(item);

          if (index === user.following.length - 1) {
            if (user) {
              successHandle(res, newFollowing.reverse());
            } else {
              return next(appError(400, 'memberNotExist', next));
            }
          }
        });
      } else {
        successHandle(res, newFollowing);
      }
    });
  }
};

module.exports = users;
