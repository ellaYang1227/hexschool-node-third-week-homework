const validator = require('validator');

const appError = require('../service/appError');
const { errorMag } = require('../service/errorHandle');

const checkBodyFormat = {
  email(email, next) {
    // 是否為 email 格式
    if (!validator.isEmail(email)) {
      return next(appError(400, `email ${errorMag.validation}`, next));
    }
  },
  password(password, next) {
    // 密碼長度至少 8 碼，且英數混合
    if (
      !validator.isLength(password, { min: 8 }) ||
      !validator.matches(password, /^(?=.*[0-9])(?=.*[a-zA-Z]).{8,}$/)
    ) {
      return next(appError(400, 'password', next));
    }
  },
  passwordIdentical(newPassword, confirmPassword, next) {
    if (newPassword !== confirmPassword) {
      return next(appError(400, 'passwordUnequal', next));
    }
  },
  name(name, next) {
    // 名字長度至少 2 字元
    if (!validator.isLength(name, { min: 2 })) {
      return next(appError(400, 'nameMinLength', next));
    }
  },
  sex(sex, next) {
    // 是否為男性或女性
    if (sex !== 'male' && sex !== 'female') {
      return next(appError(400, 'sexContent', next));
    }
  }
};

module.exports = checkBodyFormat;
