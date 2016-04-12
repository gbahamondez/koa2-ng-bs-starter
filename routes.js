'use strict';
const fs = require('fs');

module.exports = function ($jwt) {

  this.get('/login', function *(next) {
    yield next;
    this.type = 'html';
    this.body = fs.createReadStream('index.html');
  });


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
    ctx.body = 'public content';
  });


  this.get('/private', function(ctx, next) {
    ctx.body = {
      name : 'im private'
    };
  });

};