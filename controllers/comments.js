const Comment = require('../models/comments');
const successHandle = require('../service/successHandle');
const appError = require('../service/appError');
const checkObjectId = require('../tools/checkObjectId');

const comments = {
  async delComment(req, res, next) {
    const _id = req.params.id;
    const user = req.user.id;
    checkObjectId.format(_id, next);
    await Comment.findOneAndDelete({ user, _id }).then((delComment) => {
      if (delComment) {
        successHandle(res, delComment);
      } else {
        return next(appError(400, 'idOrNotBelong', next));
      }
    });
  }
};

module.exports = comments;
