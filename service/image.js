const path = require('path');

const multer = require('multer');
const upload = multer({
  // 上傳數據的限制
  limits: {
    // 最大文件大小(2mb)
    fileSize: 2 * 1024 * 1024
  },
  // 控制應上傳哪些文件以及應跳過哪些文件
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.jpg' && ext !== '.png') {
      cb(new Error('圖片格式錯誤，僅限 JPG、PNG 圖片'));
    }

    cb(null, true);
  }
}).any();

module.exports = upload;
