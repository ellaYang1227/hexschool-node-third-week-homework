const express = require('express');
const router = express.Router();
const PostsControllers = require('../controllers/posts');
const handleErrorAsync = require('../service/handleErrorAsync');

/* 取得所有貼文 */
router.get('/', PostsControllers.getPosts);

/* 新增單筆貼文 */
router.post('/', handleErrorAsync(PostsControllers.addPost));

/* 刪除所有貼文 */
router.delete('/', PostsControllers.delPosts);

/* 刪除單筆貼文 */
router.delete('/:id', PostsControllers.delPost);

/* 編輯單筆貼文 */
router.patch('/:id', handleErrorAsync(PostsControllers.etidPost));

module.exports = router;
