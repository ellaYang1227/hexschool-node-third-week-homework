const User = require('../models/users');
const successHandle = require('../service/successHandle');
const appError = require('../service/appError');
const checkBodyRequired = require('../tools/checkBodyRequired');

const requireds = ['email', 'name'];

const users = {
  async getUsers(req, res, next) {
    if (req.originalUrl === '/users') {
      const users = await User.find().sort('-createdAt');
      successHandle(res, users);
    } else {
      return next(appError(404, 'routing', next));
    }
  },
  async getUser(req, res, next) {
    const id = req.params.id;
    const user = await User.findById(id);
    if (user) {
      successHandle(res, user);
    } else {
      return next(appError(400, 'id', next));
    }
  },
  async signup(req, res, next) {
    const data = req.body;
    const bodyResultIsPass = checkBodyRequired(
      requireds,
      req.method,
      data,
      next
    );

    if (bodyResultIsPass) {
      const newUser = await User.create({
        email: data.email,
        name: data.name,
        photo: data.photo
      });

      successHandle(res, newUser);
    }
  }
};

module.exports = users;
