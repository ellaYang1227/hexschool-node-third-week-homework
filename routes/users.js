const express = require('express');
const router = express.Router();
const UsersControllers = require('../controllers/users');
const handleErrorAsync = require('../service/handleErrorAsync');

/* 取得所有會員資料 */
router.get('/', UsersControllers.getUsers);

/* 取得會員資料 */
router.get('/:id', handleErrorAsync(UsersControllers.getUser));

/* 註冊 */
router.post('/signup', handleErrorAsync(UsersControllers.signup));

module.exports = router;
