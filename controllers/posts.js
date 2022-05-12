const Post = require('../models/posts');
const User = require('../models/users');
const successHandle = require('../service/successHandle');
const { errorHandle } = require('../service/errorHandle');
const checkBodyRequired = require('../tools/checkBodyRequired');

const requireds = ['user', 'content'];

const posts = {
  async getPosts(req, res, next) {
    const { sort, keyword } = req.query;
    const createdAtSort = sort === 'asc' ? 'createdAt' : '-createdAt';
    const posts = await Post.find({ content: new RegExp(keyword) })
      .sort(createdAtSort)
      .populate({ path: 'user', select: 'name photo' });
    successHandle(res, posts);
  },
  async addPost(req, res, next) {
    try {
      const data = req.body;
      const bodyResultIsPass = checkBodyRequired(
        requireds,
        req.method,
        res,
        data
      );

      if (bodyResultIsPass) {
        const user = await User.findById(data.user);
        if (user) {
          const newPost = await Post.create({
            user: data.user,
            image: data.image,
            content: data.content,
            type: data.type,
            tags: data.tags
          });
          successHandle(res, newPost);
        } else {
          errorHandle(res, 400, 'user');
        }
      }
    } catch (error) {
      console.error(error);
      errorHandle(res, 400, error.path === '_id' ? 'user' : error.message);
    }
  },
  async delPosts(req, res, next) {
    if (req.originalUrl === '/posts') {
      await Post.deleteMany({});
      successHandle(res, []);
    } else {
      errorHandle(res, 400, 'routing');
    }
  },
  async delPost(req, res, next) {
    const id = req.params.id;
    await Post.findByIdAndDelete(id)
      .then((delPost) => {
        if (delPost._id) {
          successHandle(res, delPost);
        }
      })
      .catch((error) => {
        console.error(error);
        errorHandle(res, 400, 'id');
      });
  },
  async etidPost(req, res, next) {
    try {
      const id = req.params.id;
      const data = req.body;
      const bodyResultIsPass = checkBodyRequired(
        requireds,
        req.method,
        res,
        data
      );

      if (bodyResultIsPass) {
        await Post.findByIdAndUpdate(id, data, {
          new: true,
          runValidators: true
        }).then((update) => {
          if (update) {
            successHandle(res, update);
          } else {
            errorHandle(res, 400, 'id');
          }
        });
      }
    } catch (error) {
      const err = error.path === '_id' ? 'id' : error.message;
      errorHandle(res, 400, err);
    }
  }
};

module.exports = posts;
