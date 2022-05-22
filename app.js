const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const app = express();

const { errorHandle } = require('./service/errorHandle');

require('./connections');

const indexRouter = require('./routes/index');
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');

// 補捉程式錯誤
process.on('uncaughtException', (err) => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
  console.error('Uncaughted Exception！');
  console.error(err);
  process.exit(1);
});

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// router 入口
app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);

// 404 錯誤
app.use((req, res, next) => {
  errorHandle(res, 404, 'routing');
});

// express 錯誤處理(上線(Prod)-自己設定的 err 錯誤 & 開發(dev)環境錯誤)
const resErrorProd = (err, res) => {
  if (err.isOperational) {
    errorHandle(res, err.statusCode, err.message);
  } else {
    // log 紀錄
    console.error('出現重大錯誤', err);
    // 送出罐頭預設訊息
    errorHandle(res, 500, '500');
  }
};

const resErrorDev = (err, res) => {
  errorHandle(res, err.statusCode, err.message, err, err.stack);
};

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  // dev
  if (process.env.NODE_ENV === 'dev') {
    return resErrorDev(err, res);
  }

  // prod
  if (err.isAxiosError == true) {
    err.message = 'axios';
    err.isOperational = true;
    return resErrorProd(err, res);
  } else if (err.name === 'ValidationError') {
    err.message = 'validation';
    err.isOperational = true;
    return resErrorProd(err, res);
  } else if (err.name === 'CastError') {
    err.message = err.path === '_id' ? 'id' : 'validation';
    err.isOperational = true;
    return resErrorProd(err, res);
  } else if (err.name === 'SyntaxError') {
    err.message = 'syntax';
    err.isOperational = true;
    return resErrorProd(err, res);
  } else if (err.name === 'SyntaxError') {
    err.message = 'syntax';
    err.isOperational = true;
    return resErrorProd(err, res);
  } else if (err.code === 11000) {
    if (err.keyPattern.email) {
      err.message = 'emailExist';
    } else {
      const keyPatterns = Object.keys(err.keyPattern);
      err.message = `${keyPatterns} 為唯一索引，已存在`;
    }

    err.isOperational = true;
    return resErrorProd(err, res);
  }

  resErrorProd(err, res);
});

// 未捕捉到的 catch
process.on('unhandledRejection', (reason, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', reason);
  // 記錄於 log 上
});

module.exports = app;
