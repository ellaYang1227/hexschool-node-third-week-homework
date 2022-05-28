// 錯誤訊息
const errorMag = {
  id: '沒有此 _id',
  data: '沒有資料或空值',
  requireds: '必填欄位',
  validation: '格式錯誤',
  password: '密碼需至少 8 碼以上，並英數混合',
  passwordUnequal: '密碼不一致',
  emailExist: '帳號已被註冊，請替換新的 Email！',
  memberNotExist: '此會員不存在',
  signIn: '帳號或密碼錯誤，請重新輸入！',
  nameMinLength: '至少 2 個字元以上',
  sexContent: '性別只能填寫 male 或 female',
  uploadFiles: '尚未上傳檔案',
  multerErrorSize: '圖片檔案過大，僅限 2mb 以下檔案',
  imgEqualSize: '圖片寬高比必需為 1:1，請重新輸入',
  imgWidthSize: '解析度寬度至少 300 像素以上，請重新輸入',
  noAuthorization: '您尚未登入！',
  axios: 'axios 連線錯誤',
  routing: '沒有此路由',
  syntax: '語法錯誤',
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
