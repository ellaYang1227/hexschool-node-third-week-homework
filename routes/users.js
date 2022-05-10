const express = require('express');
const router = express.Router();
const UsersControllers = require('../controllers/users');

/* 取得所有會員資料 */
router.get('/', UsersControllers.getUsers);

/* 取得會員資料 */
router.get('/:id', UsersControllers.getUser);

/* 註冊 */
router.post('/signup', UsersControllers.signup);

module.exports = router;
