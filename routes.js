'use strict';
const fs = require('fs');

module.exports = function ($jwt) {

  this.post('/login', function(ctx, next) {
    console.log('body -->', ctx.request.body);
    var token = $jwt.sign(
      ctx.request.body,
      'some secret',
      { expiresIn: 60 }
    );
    ctx.body = {token : token};
  });


  this.get('/public', function(ctx, next) {
    ctx.body = {
      message : 'public content'
    };
  });

  this.get('/getdata', function(ctx) {
    ctx.body = ['im', 'the', 'data'];
  });

  this.get('/private', function(ctx, next) {
    ctx.body = {
      message : 'private content'
    };
  });

  this.get('/users', function(ctx, next) {
    ctx.body = [{
      username : 'gbahamondez'
    }, {
      useraname : 'alxnew2'
    }];
  });

  this.get('*', function *(next) {
    console.log("i'm here");
    yield next;
    this.type = 'html';
    this.body = fs.createReadStream('./dist/index.html');
  });

  this.get('/some', function(ctx) {
    ctx.body = 'some';
  });
};