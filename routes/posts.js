const express = require('express');
const router = express.Router();
const Post = require('../models/posts');
const successHandle = require('../service/successHandle');
const errorHandle = require('../service/errorHandle');

/* 取得所有貼文 */
router.get('/', async(req, res, next) => {
  const posts = await Post.find();
  successHandle(res, posts);
});

/* 新增單筆貼文 */
router.post('/', async(req, res, next) => {
  try{
    const data = req.body;
    const newPost = await Post.create({
    'name': data.name,
    'image': data.image,
    'content': data.content,
    'type': data.type,
    'tags': data.tags
    });

    successHandle(res, newPost);
  }catch(error){
    console.error(error);
    errorHandle(res, 404, error.message);
  }
});

/* 刪除所有貼文 */
router.delete('/', async(req, res, next) => {
  await Post.deleteMany({});
  successHandle(res, []);
});

/* 刪除單筆貼文 */
router.delete('/:id', async(req, res, next) => {
  const id = req.params.id;
  await Post.findByIdAndDelete(id)
    .then(delPost => {
      if(delPost._id){ successHandle(res, delPost) }
    })
    .catch(error => {
      console.error(error);
      errorHandle(res, 404, 'id');
    });
});

/* 編輯單筆貼文 */
router.patch('/:id', async(req, res, next) => {
  const id = req.params.id;
  const data = req.body;
  console.log(data);
  if(JSON.stringify(data) !== '{}'){
    try{
      await Post.findByIdAndUpdate(id, data, {new: true, runValidators:true})
        .then(update => {
          if(update){ 
            successHandle(res, update)
          }else{
            errorHandle(res, 400, 'id');
          }
        });
    }catch(error){
      console.error(error);
      errorHandle(res, 404, error.message);
    }
  }else{
    errorHandle(res, 404, 'data');
  }
});

module.exports = router;
