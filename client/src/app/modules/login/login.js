'use strict';

const name = 'login';
import loginTemplate from './login.html';
import angular from 'angular';

angular.module(name, ['ui.router'])

.config(function($stateProvider) {
  $stateProvider.state(name, {
    url         : '/login',
    template    : loginTemplate,
    controller  : 'LoginController'
  });
})

.controller('LoginController', function($scope, $auth, $location) {
  $scope.user  = {};
  $scope.login = function() {
    $auth.login({
      email : $scope.user.email,
      password : $scope.user.password
    })
    .then(function(data) {
      console.log(data);
      $location.path('/home');
    })
    .catch(function(err) {
      console.log(err);
    });
  };
});

export default name;
