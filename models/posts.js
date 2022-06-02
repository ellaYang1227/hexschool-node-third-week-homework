const mongoose = require('mongoose');
// - name：貼文姓名(必填)
// - image：貼文圖片
// - content：貼文內容(必填)
// - likes：按讚數
// - comments：留言數
// - createdAt：發文時間
const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'User ID 必填']
    },
    image: {
      type: String,
      default: '',
      cast: false
    },
    content: {
      type: String,
      required: [true, '貼文內容必填'],
      cast: false
    },
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false, // 移除欄位 __v
    toJSON: { virtuals: true }, // postSchema.virtual 設定
    toObject: { virtuals: true } // postSchema.virtual 設定
  }
);

// 使用到才引用
postSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'post',
  localField: '_id'
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
