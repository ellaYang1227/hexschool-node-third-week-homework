const Post = require('../models/posts');
const successHandle = require('../service/successHandle');
const appError = require('../service/appError');
const checkBodyRequired = require('../tools/checkBodyRequired');

const requireds = ['content'];

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
    const data = req.body;
    const bodyResultIsPass = checkBodyRequired(
      requireds,
      req.method,
      data,
      next
    );

    if (bodyResultIsPass) {
      const newPost = await Post.create({
        user: req.user.id,
        image: data.image,
        content: data.content,
        type: data.type,
        tags: data.tags
      });

      successHandle(res, newPost);
    }
  },
  async delPosts(req, res, next) {
    if (req.originalUrl === '/posts') {
      await Post.deleteMany({});
      successHandle(res, []);
    } else {
      return next(appError(404, 'routing', next));
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
        return next(appError(400, 'id', next));
      });
  },
  async etidPost(req, res, next) {
    const id = req.params.id;
    const data = req.body;
    const bodyResultIsPass = checkBodyRequired(
      requireds,
      req.method,
      data,
      next
    );

    if (bodyResultIsPass) {
      await Post.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
      }).then((update) => {
        if (update) {
          successHandle(res, update);
        } else {
          return next(appError(400, 'id', next));
        }
      });
    }
  }
};

module.exports = posts;
