const errorMag = {
  data: '沒有資料或空值',
  email: '此 email 帳號已註冊',
  id: '沒有此 _id',
  format: '格式錯誤',
  routing: '沒有此路由',
  requireds: '必填欄位',
  user: '沒有此 user'
};

const errorHandle = (res, statusCode, error) => {
  error = errorMag.hasOwnProperty(error) ? errorMag[error] : error;
  res.status(statusCode).json({
    success: false,
    error: error
  });
};

module.exports = { errorMag, errorHandle };
