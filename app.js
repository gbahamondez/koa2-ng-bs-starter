'use strict';

const Koa = require('koa');
const router = require('koa-load-routes');
const logger = require('koa-logger');
const serve = require('koa-static');

var app = new Koa();

app.use(serve('./public'));
app.use(logger());

app = router(app, {
  path : '/routes.js'
});

app.listen(3000,  () => {
  console.log('app started at http://127.0.0.1:3000/');
});