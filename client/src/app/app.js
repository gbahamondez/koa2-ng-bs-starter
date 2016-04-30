'use strict';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../sass/signin.scss';
import '../sass/view-slide-in.scss';

import angular from 'angular';

import ngAnimate from 'angular-animate';
import ngResource from 'angular-resource';
import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
import satellizer from 'satellizer';

import login from './modules/login/login.js';
import home from './modules/home/home.js';

import UsersService from './services/user.js';

var app = angular.module('app', [
  satellizer,
  ngAnimate,
  ngResource,
  uiBootstrap,
  uiRouter,
  login,
  home,
  UsersService
]);

app.config(function ($urlRouterProvider, $locationProvider, $authProvider) {
  $locationProvider.html5Mode(true);

  $authProvider.loginUrl = '/login';
  $urlRouterProvider.otherwise('/login');
});

