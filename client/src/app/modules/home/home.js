'use strict';

const name = 'home';

import homeTemplate from './home.html';
import angular from 'angular';

angular.module(name, ['ui.router'])

.config(function($stateProvider) {
  $stateProvider.state(name, {
    url         : '/home',
    template    : homeTemplate,
    controller  : 'HomeController'
  });
})

.controller('HomeController', function ($scope, $auth, $location, UserFactory) {

  UserFactory.query()
    .$promise
    .then(data => {
      console.log(data);
    })
    .catch(err => {
      console.log(err);
    });

  $scope.isAuthenticated = function (){
    return $auth.isAuthenticated();
  };

  $scope.logout = function() {
    $auth.logout();
    $location.path('/login');
  };

  console.log("is auth", $scope.isAuthenticated());
});

export default name;