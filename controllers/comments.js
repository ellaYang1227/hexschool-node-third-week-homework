const Comment = require('../models/comments');
const successHandle = require('../service/successHandle');
const appError = require('../service/appError');

const comments = {
  async delComment(req, res, next) {
    const id = req.params.id;
    const user = req.user.id;
    await Comment.findOneAndDelete({ user, _id: id }).then((delComment) => {
      if (delComment) {
        successHandle(res, delComment);
      } else {
        return next(appError(400, 'idOrNotBelong', next));
      }
    });
  }
};

module.exports = comments;
