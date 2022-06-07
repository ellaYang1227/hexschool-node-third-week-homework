const express = require('express');
const router = express.Router();

const uploadControllers = require('../controllers/upload');
const { isAuth } = require('../service/auth');
const upload = require('../service/image');
const handleErrorAsync = require('../service/handleErrorAsync');

/* 1.上傳圖片 */
router.post('/', upload, isAuth, handleErrorAsync(uploadControllers.postImg));

module.exports = router;
