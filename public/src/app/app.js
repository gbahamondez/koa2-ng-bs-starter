'use strict';

require('bootstrap/dist/css/bootstrap.min.css');
require('../sass/signin.scss');

var angular = require('angular');

require('angular-ui-router');

var uiRouter = 'ui.router';

var ngAnimate = require('angular-animate');
var uiBootstrap = require('angular-ui-bootstrap');
var satellizer = require('satellizer');
var login = require("./modules/login.js")(angular, uiRouter);


var app = angular.module('app', [
  satellizer,
  ngAnimate,
  uiBootstrap,
  uiRouter,
  login
]);

app.config(function ($urlRouterProvider, $authProvider) {
  $authProvider.loginUrl = '/login';
  $urlRouterProvider.otherwise("/login");
});

