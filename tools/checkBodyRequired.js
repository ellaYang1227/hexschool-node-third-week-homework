const appError = require('../service/appError');
const { errorMag } = require('../service/errorHandle');

const checkBodyRequired = (requireds, method, body, next) => {
  let count = 0;
  let errors = [];
  requireds.forEach((item) => {
    // POST - 不能沒有傳 requireds 欄位名稱
    // PATCH - body 只要有傳 requireds 欄位名稱一個即可
    if (
      (method === 'POST' && body[item] === undefined) ||
      (method === 'PATCH' && JSON.stringify(body) === '{}')
    ) {
      if (method === 'POST') {
        errors.push(`${item} ${errorMag.requireds}`);
      } else {
        return next(appError(400, 'data', next));
      }
    } else if (
      body[item] === '' ||
      (Array.isArray(body[item]) && !body[item].length)
    ) {
      errors.push(`${item} ${errorMag.requireds}`);
    } else {
      count += 1;
    }
  });

  if (count === requireds.length) {
    return true;
  } else {
    console.error(errors);
    return next(appError(400, errors, next));
  }
};

module.exports = checkBodyRequired;
