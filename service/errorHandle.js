const errorMag = {
    'data': '沒有資料或空值',
    'id': '沒有此 _id',
    'format': '格式錯誤',
    'routing': '沒有此路由',
    'requireds': '必填欄位'
};

const errorHandle = (res, statusCode, error) => {
  console.log('123')
  error = errorMag.hasOwnProperty(error) ? errorMag[error] : error;
    res.status(statusCode).json({
      "status": false,
      "error": error
    });
};

module.exports = { errorMag, errorHandle };