'use strict';
const fs = require('fs');

module.exports = function () {

  this.get('/', function *(next) {
    yield next;
    this.type = 'html';
    this.body = fs.createReadStream('index.html');
  });

};