const express = require('express');
const router = express.Router();

const PostsControllers = require('../controllers/posts');
const handleErrorAsync = require('../service/handleErrorAsync');
const { isAuth } = require('../service/auth');

/* 1.取得所有貼文 */
router.get('/', isAuth, PostsControllers.getPostsOrPost);

/* 2.取得單一貼文 */
router.get('/:id', isAuth, PostsControllers.getPostsOrPost);

/* 3.新增單筆貼文 */
router.post('/', isAuth, handleErrorAsync(PostsControllers.addPost));

/* 4.新增一則貼文的讚 */
router.post(
  '/:id/like',
  isAuth,
  handleErrorAsync(PostsControllers.addPostLike)
);

/* 5.取消一則貼文的讚 */
router.delete(
  '/:id/unlike',
  isAuth,
  handleErrorAsync(PostsControllers.postUnlike)
);

/* 6.新增一則貼文的留言 */
router.post(
  '/:id/comment',
  isAuth,
  handleErrorAsync(PostsControllers.addPostComment)
);

/* 7.取得個人所有貼文列表 */
router.get('/user/:userId', isAuth, PostsControllers.getUserPosts);

/* (額外)刪除全部貼文 */
router.delete('/', isAuth, PostsControllers.delPosts);

/* (額外)刪除單筆貼文 */
router.delete('/:id', isAuth, PostsControllers.delPost);

/* (額外)編輯單筆貼文 */
router.patch('/:id', isAuth, handleErrorAsync(PostsControllers.etidPost));

module.exports = router;
