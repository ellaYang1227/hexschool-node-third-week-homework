const { ImgurClient } = require('imgur');

const successHandle = require('../service/successHandle');
const customizeValidator = require('../tools/customizeValidator');

const upload = {
  async postImg(req, res, next) {
    // 圖片使用單元(post 或 user)
    let { unit } = req.query;
    unit = unit ? unit : 'post';
    customizeValidator.uploadFiles(req.files.length, next);

    // 圖片用於 user
    if (unit === 'user') {
      const fileBuffer = req.files[0].buffer;
      customizeValidator.imgEqualSize(fileBuffer, next);
      customizeValidator.imgWidthSize(fileBuffer, next);
    }

    // 上傳 Imgur
    const client = new ImgurClient({
      clientId: process.env.IMGUR_CLIENT_ID,
      clientSecret: process.env.IMGUR_CLIENT_SECRET,
      refreshToken: process.env.IMGUR_REFRESH_TOKEN
    });

    const response = await client.upload({
      image: req.files[0].buffer.toString('base64'),
      type: 'base64',
      album: process.env.IMGUR_ALBUM_ID
    });

    successHandle(res, response.data.link);
  }
};

module.exports = upload;
