const Post = require('../models/posts');
const Comment = require('../models/comments');
const successHandle = require('../service/successHandle');
const appError = require('../service/appError');
const checkBodyRequired = require('../tools/checkBodyRequired');
const checkObjectId = require('../tools/checkObjectId');
const User = require('../models/users');

const postRequireds = ['content'];
const commentRequireds = ['comment'];

const getCreatedAtSort = (sort) => {
  return sort === 'asc' ? 'createdAt' : '-createdAt';
};
const userPopulate = { path: 'user', select: 'name photo' };
const commentsPopulate = { path: 'comments', select: 'comment user createdAt' };

const posts = {
  async getPostsOrPost(req, res, next) {
    const _id = req.params.id;
    const { sort, keyword } = req.query;
    const createdAtSort = getCreatedAtSort(sort);
    const find = { content: new RegExp(keyword) };
    find._id = _id;
    let data;
    // 有傳 id 取得單一貼文；反之則全部貼文
    if (find._id) {
      checkObjectId.format(find._id, next);
      const findPost = checkObjectId.findById('Post', find._id, next);
      if (findPost) {
        data = await Post.findOne(find)
          .sort(createdAtSort)
          .populate(userPopulate)
          .populate(commentsPopulate);
      }
    } else {
      data = await Post.find(find)
        .sort(createdAtSort)
        .populate(userPopulate)
        .populate(commentsPopulate);
    }

    successHandle(res, data);
  },
  async addPost(req, res, next) {
    const data = req.body;
    const bodyResultIsPass = checkBodyRequired(
      postRequireds,
      req.method,
      data,
      next
    );

    if (bodyResultIsPass) {
      const newPost = await Post.create({
        user: req.user.id,
        image: data.image,
        content: data.content
      });

      successHandle(res, newPost);
    }
  },
  async addPostLike(req, res, next) {
    const _id = req.params.id;

    checkObjectId.format(_id, next);
    const findPost = checkObjectId.findById('Post', _id, next);

    if (findPost) {
      await Post.findOneAndUpdate(
        { _id },
        { $addToSet: { likes: req.user.id } },
        {
          new: true,
          runValidators: true
        }
      ).then((update) => {
        if (update) {
          successHandle(res, update);
        } else {
          return next(appError(400, 'id', next));
        }
      });
    }
  },
  async postUnlike(req, res, next) {
    const _id = req.params.id;
    checkObjectId.format(_id, next);
    const findPost = checkObjectId.findById('Post', _id, next);

    if (findPost) {
      await Post.findOneAndUpdate(
        { _id },
        { $pull: { likes: req.user.id } },
        {
          new: true,
          runValidators: true
        }
      ).then((update) => {
        if (update) {
          successHandle(res, update);
        } else {
          return next(appError(400, 'id', next));
        }
      });
    }
  },
  async addPostComment(req, res, next) {
    const data = req.body;
    const bodyResultIsPass = checkBodyRequired(
      commentRequireds,
      req.method,
      data,
      next
    );

    if (bodyResultIsPass) {
      const _id = req.params.id;
      checkObjectId.format(_id, next);
      const findPost = checkObjectId.findById('Post', _id, next);

      if (findPost) {
        await Comment.create({
          post: _id,
          user: req.user.id,
          comment: data.comment
        });

        const post = await Post.findById(_id)
          .populate(userPopulate)
          .populate(commentsPopulate);

        successHandle(res, post);
      }
    }
  },
  async getUserPosts(req, res, next) {
    const user = req.params.userId;
    const { sort, keyword } = req.query;
    const createdAtSort = getCreatedAtSort(sort);
    const userData = await User.findById(user);
    if (userData) {
      const posts = await Post.find({
        user,
        content: new RegExp(keyword)
      })
        .sort(createdAtSort)
        .populate(userPopulate)
        .populate(commentsPopulate);
      successHandle(res, {
        user: userData,
        posts
      });
    } else {
      return next(appError(404, 'memberNotExist', next));
    }
  },
  async delPosts(req, res, next) {
    const user = req.user.id;
    if (req.originalUrl === '/posts') {
      await Post.deleteMany({ user });
      successHandle(res, []);
    } else {
      return next(appError(404, 'routing', next));
    }
  },
  async delPost(req, res, next) {
    const _id = req.params.id;
    const user = req.user.id;
    checkObjectId.format(_id, next);
    await Post.findOneAndDelete({ user, _id })
      .populate(userPopulate)
      .populate(commentsPopulate)
      .then((delPost) => {
        if (delPost) {
          successHandle(res, delPost);
        } else {
          return next(appError(400, 'idOrNotBelong', next));
        }
      });
  },
  async etidPost(req, res, next) {
    const _id = req.params.id;
    const user = req.user.id;
    const data = req.body;

    const bodyResultIsPass = checkBodyRequired(
      postRequireds,
      req.method,
      data,
      next
    );

    if (bodyResultIsPass) {
      checkObjectId.format(_id, next);
      await Post.findOneAndUpdate({ user, _id }, data, {
        new: true,
        runValidators: true
      })
        .populate(userPopulate)
        .populate(commentsPopulate)
        .then((update) => {
          if (update) {
            successHandle(res, update);
          } else {
            return next(appError(400, 'idOrNotBelong', next));
          }
        });
    }
  }
};

module.exports = posts;
