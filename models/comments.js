const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, '留言內容必填'],
      cast: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'User ID 必填']
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
      required: [true, '貼文 ID 必填']
    }
  },
  {
    versionKey: false // 移除欄位 __v
  }
);

// 所有 find 開頭的指令
commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'id name photo createdAt'
  });

  next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
