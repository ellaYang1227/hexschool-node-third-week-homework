const express = require('express');
const router = express.Router();

const UsersControllers = require('../controllers/users');
const handleErrorAsync = require('../service/handleErrorAsync');
const { isAuth } = require('../service/auth');

/* 註冊 */
router.post('/sign_up', handleErrorAsync(UsersControllers.signUp));

/* 登入 */
router.post('/sign_in', handleErrorAsync(UsersControllers.signIn));

/* 重設密碼 */
router.post(
  '/updatePassword',
  isAuth,
  handleErrorAsync(UsersControllers.updatePassword)
);

/* 取得個人資料 */
router.get('/profile', isAuth, handleErrorAsync(UsersControllers.getProfile));

/* 更新個人資料 */
router.patch(
  '/profile',
  isAuth,
  handleErrorAsync(UsersControllers.updateProfile)
);

module.exports = router;
