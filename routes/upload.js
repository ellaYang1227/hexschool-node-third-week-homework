const express = require('express');
const router = express.Router();

const uploadControllers = require('../controllers/upload');
const { isAuth } = require('../service/auth');
const upload = require('../service/image');
const handleErrorAsync = require('../service/handleErrorAsync');

/* 上傳圖片 */
router.post('/', isAuth, upload, handleErrorAsync(uploadControllers.postImg));

module.exports = router;
