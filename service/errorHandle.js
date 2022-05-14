// 錯誤訊息
const errorMag = {
  axios: 'axios 連線錯誤',
  data: '沒有資料或空值',
  email: '此 email 帳號已註冊',
  id: '沒有此 _id',
  validation: '資料欄位格式錯誤',
  syntax: '語法錯誤',
  routing: '沒有此路由',
  requireds: '必填欄位',
  user: '沒有此 user',
  500: '系統錯誤，請洽系統管理員'
};

const errorHandle = (res, statusCode, message, error, stack) => {
  message = errorMag.hasOwnProperty(message) ? errorMag[message] : message;

  const send = {
    success: false,
    message
  };

  if (error) {
    send.error = error;
  }

  if (stack) {
    send.stack = stack;
  }

  res.status(statusCode).json(send);
};

module.exports = { errorMag, errorHandle };
