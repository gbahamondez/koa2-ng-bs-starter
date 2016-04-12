'use strict';

const Koa = require('koa');
const router = require('koa-load-routes');
const logger = require('koa-logger');
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
const convert = require('koa-convert');
const jwt = require('koa-jwt');

var app = new Koa();

app.use(serve('./public'));
app.use(logger());
app.use(bodyParser());

app.use(convert(
  jwt({ secret: 'some secret' })
    .unless({ path: [
      /^\/public/,
      /^\/login/
    ]})
));

app.use(router({
  path : '/routes.js'
}));

app.listen(3000,  () => {
  console.log('app started at http://127.0.0.1:3000/');
});