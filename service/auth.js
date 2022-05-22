const jwt = require('jsonwebtoken');

const User = require('../models/users');
const successHandle = require('./successHandle');
const appError = require('./appError');
const { errorMag } = require('./errorHandle');
const handleErrorAsync = require('./handleErrorAsync');

// isAuth middleware
const isAuth = handleErrorAsync(async (req, res, next) => {
  let token;

  // 驗證 req.headers.authorization 是否存在
  if (!req.headers.authorization) {
    return next(appError(401, 'noAuthorization', next));
  }

  // 是否為 Bearer 開頭
  if (!req.headers.authorization.startsWith('Bearer')) {
    return next(appError(401, `token ${errorMag.validation}`, next));
  }

  token = req.headers.authorization.split(' ').pop();
  // 驗證 token 正確性
  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });

  // 解密後的 JWT
  // {
  //   "id": "6249368f98f7f965568ad019",
  //   "iat": 1648968184,
  //   "exp": 1712040184,
  //   "name": "楊小奕",
  //   "photo": ""
  // }

  // 用解密的 JWT 取得此當前 user 資料
  const currentUser = await User.findById(decoded.id);

  // req 內寫入將當前 user 資料，並帶往下一站
  req.user = currentUser;
  next();
});

// 產生 JWT token：payload、secret、option
const generateSendJWT = (res, user) => {
  const tokenData = {
    id: user._id,
    name: user.name,
    photo: user.photo
  };

  const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY
  });

  // token 產生結果
  // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.  # header
  // eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.  # payload
  // TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ  # signature

  successHandle(res, { token });
};

module.exports = { isAuth, generateSendJWT };
