// 自訂義可預期的錯誤
const appError = (statusCode, errMessage, next) => {
  // new Error() 參數 - errMessage 錯誤訊息
  const error = new Error(errMessage);
  error.statusCode = statusCode;
  // 是否為自訂義錯誤
  error.isOperational = true;
  next(error);
};

module.exports = appError;
