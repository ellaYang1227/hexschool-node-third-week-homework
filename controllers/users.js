const User = require('../models/users');
const successHandle = require('../service/successHandle');
const { errorHandle } = require('../service/errorHandle');
const checkBodyRequired = require('../tools/checkBodyRequired');

const requireds = ['email', 'name'];

const users = {
  async getUsers(req, res, next) {
    const users = await User.find().sort('-createdAt');
    successHandle(res, users);
  },
  async getUser(req, res, next) {
    try {
      const id = req.params.id;
      const user = await User.findById(id);
      if (user) {
        successHandle(res, user);
      } else {
        errorHandle(res, 400, 'id');
      }
    } catch (error) {
      console.error(error);
      const err = error.path === '_id' ? 'id' : error.message;
      errorHandle(res, 400, err);
    }
  },
  async signup(req, res, next) {
    try {
      const data = req.body;
      const bodyResultIsPass = checkBodyRequired(
        requireds,
        req.method,
        res,
        data
      );

      if (bodyResultIsPass) {
        const newUser = await User.create({
          email: data.email,
          name: data.name,
          photo: data.photo
        });

        successHandle(res, newUser);
      }
    } catch (error) {
      console.error(error);
      errorHandle(res, 400, error.message);
    }
  }
};

module.exports = users;
