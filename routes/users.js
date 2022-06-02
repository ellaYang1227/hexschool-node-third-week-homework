const express = require('express');
const router = express.Router();

const UsersControllers = require('../controllers/users');
const handleErrorAsync = require('../service/handleErrorAsync');
const { isAuth } = require('../service/auth');

/* 1.會員功能 */
/* 1-1.註冊 */
router.post('/sign_up', handleErrorAsync(UsersControllers.signUp));

/* 1-2.登入 */
router.post('/sign_in', handleErrorAsync(UsersControllers.signIn));

/* 1-3.重設密碼 */
router.post(
  '/updatePassword',
  isAuth,
  handleErrorAsync(UsersControllers.updatePassword)
);

/* 1-4.取得個人資料 */
router.get('/profile', isAuth, handleErrorAsync(UsersControllers.getProfile));

/* 1-5.更新個人資料 */
router.patch(
  '/profile',
  isAuth,
  handleErrorAsync(UsersControllers.updateProfile)
);

/* 2.會員按讚追蹤動態 */
/* 2-1.追蹤朋友 */
router.post(
  '/:id/follow',
  isAuth,
  handleErrorAsync(UsersControllers.addFollow)
);

/* 2-2.取消追蹤朋友 */
router.delete(
  '/:id/unfollow',
  isAuth,
  handleErrorAsync(UsersControllers.unfollow)
);

/* 2-3.取得個人按讚列表 */
router.get(
  '/getLikeList',
  isAuth,
  handleErrorAsync(UsersControllers.getLikeList)
);

/* 2-4.取得個人追蹤名單 */
router.get(
  '/following',
  isAuth,
  handleErrorAsync(UsersControllers.myFollowing)
);

module.exports = router;
