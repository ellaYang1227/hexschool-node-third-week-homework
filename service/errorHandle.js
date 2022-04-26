const errorMag = {
    'data': '沒有資料',
    'id': '沒有此 _id',
    'format': '格式錯誤',
    'routing': '沒有此路由'
};

const errorHandle = (res, statusCode, error) => {
  error = errorMag.hasOwnProperty(error) ? errorMag[error] : error;
    res.status(statusCode).json({
      "status": false,
      "error": error
    });
};

module.exports = errorHandle;