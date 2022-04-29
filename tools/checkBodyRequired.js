const { errorMag, errorHandle } = require('../service/errorHandle');

const checkBodyRequired = (method, res, body) => {
  const requireds = ['name', 'content', 'type', 'tags'];
  let count = 0;
  try{
    let errors = [];
    requireds.forEach(item => {
      // POST - 不能沒有傳 requireds 欄位名稱
      // PATCH - 只要有傳 requireds 欄位名稱一個即可
      if(method === 'POST' && body[item] === undefined || method === 'PATCH' && JSON.stringify(body) === '{}'){
        errors.push(`${item} ${errorMag.requireds}`);
      }else if(body[item] === '' || body[item] && !body[item].length){
        errors.push(`${item} ${errorMag.requireds}`);
      }else{
          count += 1;
      }
    });

    if (count === requireds.length) { 
      return true 
    }else{
      throw errors;
    }
  }catch(error){
    console.log(error);
    errorHandle(res, 400, error);
  }
};

module.exports = checkBodyRequired;