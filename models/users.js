const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'email 必填'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'email 格式錯誤'
      ],
      unique: true, // 每個索引都是唯一的
      lowercase: true,
      cast: false,
      select: false
    },
    // password: {
    //   type: String,
    //   required: [true, '密碼必填'],
    //   minLength: 8,
    //   cast: false,
    //   select: false
    // },
    name: {
      type: String,
      required: [true, '暱稱必填'],
      cast: false
    },
    photo: {
      type: String,
      default: '',
      cast: false
    },
    // sex: {
    //   type: String,
    //   enum: ['male', 'female'],
    //   cast: false
    // },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false
    }
  },
  {
    versionKey: false // 移除欄位 __v
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
