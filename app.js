'use strict';

const Koa = require('koa');
const router = require('koa-load-routes');
const logger = require('koa-logger');
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
const convert = require('koa-convert');
const jwt = require('koa-jwt');

var app = new Koa();

app.use(serve('./dist'));
app.use(logger());
app.use(bodyParser());


app.use(function(ctx, next) {
  return next()
    .catch(function(err) {
      if (401 == err.status) {
        ctx.status = 401;
        ctx.body = 'Protected resource, use Authorization header to get access\n';
      } else {
        throw err;
      }
    });
});

app.use(convert(
  jwt({ secret: 'some secret' })
    .unless({
      path: ['/', '/login', '/public', '/home']
    })
));

app.use(router({
  path : './routes.js',
  args : [jwt]
}));


app.listen(3000, () => {
  console.log('app started at http://127.0.0.1:3000/');
});