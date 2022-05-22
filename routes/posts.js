const express = require('express');
const router = express.Router();

const PostsControllers = require('../controllers/posts');
const handleErrorAsync = require('../service/handleErrorAsync');
const { isAuth } = require('../service/auth');

/* 取得所有貼文 */
router.get('/', isAuth, PostsControllers.getPosts);

/* 新增單筆貼文 */
router.post('/', isAuth, handleErrorAsync(PostsControllers.addPost));

/* 刪除所有貼文 */
router.delete('/', isAuth, PostsControllers.delPosts);

/* 刪除單筆貼文 */
router.delete('/:id', isAuth, PostsControllers.delPost);

/* 編輯單筆貼文 */
router.patch('/:id', isAuth, handleErrorAsync(PostsControllers.etidPost));

module.exports = router;
