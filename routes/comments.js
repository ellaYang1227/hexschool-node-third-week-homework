const express = require('express');
const router = express.Router();

const CommentsControllers = require('../controllers/comments');
const { isAuth } = require('../service/auth');

/* (額外)刪除一則貼文的留言 */
router.delete('/:id', isAuth, CommentsControllers.delComment);

module.exports = router;
