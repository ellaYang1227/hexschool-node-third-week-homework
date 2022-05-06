const Post = require("../models/posts");
const successHandle = require("../service/successHandle");
const { errorHandle } = require("../service/errorHandle");
const checkBodyRequired = require("../tools/checkBodyRequired");

const posts = {
  async getPosts(req, res, next) {
    // 貼文時間：新到舊
    const posts = await Post.find().sort({ createdAt: -1 });
    successHandle(res, posts);
  },
  async addPost(req, res, next) {
    try {
      const data = req.body;
      const bodyResultIsPass = checkBodyRequired(req.method, res, data);

      if (bodyResultIsPass) {
        const newPost = await Post.create({
          name: data.name,
          image: data.image,
          content: data.content,
          type: data.type,
          tags: data.tags,
        });

        successHandle(res, newPost);
      }
    } catch (error) {
      console.error(error);
      errorHandle(res, 400, error.message);
    }
  },
  async delPosts(req, res, next) {
    if (req.originalUrl === "/posts") {
      await Post.deleteMany({});
      successHandle(res, []);
    } else {
      errorHandle(res, 400, "routing");
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
        errorHandle(res, 400, "id");
      });
  },
  async etidPost(req, res, next) {
    try {
      const id = req.params.id;
      const data = req.body;
      const bodyResultIsPass = checkBodyRequired(req.method, res, data);

      if (bodyResultIsPass) {
        await Post.findByIdAndUpdate(id, data, {
          new: true,
          runValidators: true,
        }).then((update) => {
          if (update) {
            successHandle(res, update);
          } else {
            errorHandle(res, 400, "id");
          }
        });
      }
    } catch (error) {
      const err = error.path === "_id" ? "id" : error.message;
      errorHandle(res, 400, err);
    }
  },
};

module.exports = posts;
