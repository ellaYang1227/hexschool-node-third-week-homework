const express = require('express');
const router = express.Router();
const PostsControllers = require('../controllers/posts');

/* 取得所有貼文 */
router.get('/', PostsControllers.getPosts);

/* 新增單筆貼文 */
router.post('/', PostsControllers.addPost);

/* 刪除所有貼文 */
router.delete('/', PostsControllers.delPosts);

/* 刪除單筆貼文 */
router.delete('/:id', PostsControllers.delPost);

/* 編輯單筆貼文 */
router.patch('/:id', PostsControllers.etidPost);

module.exports = router;
