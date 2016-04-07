'use strict';

require('bootstrap/dist/css/bootstrap.min.css');
require('../css/signin.css');

var angular = require('angular');

require('angular-ui-router');

var uiRouter = 'ui.router';

var ngAnimate = require('angular-animate');
var uiBootstrap = require('angular-ui-bootstrap');
var login = require('./modules/login.js')(angular, uiRouter);

console.log("hello a");

var app = angular.module('app', [
  ngAnimate,
  uiBootstrap,
  uiRouter,
  login
]);

app.config(["$urlRouterProvider", function ($urlRouterProvider) {
  $urlRouterProvider.otherwise("/login");
}]);

