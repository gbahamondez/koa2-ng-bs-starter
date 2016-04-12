'use strict';

module.exports = function (angular, uiRouter) {

  var name = 'login';

  angular.module(name, [uiRouter])

  .config(function($stateProvider) {
    $stateProvider.state('home', {
      url         : '/home',
      templateUrl : '/templates/home.html',
      controller  : 'HomeController'
    });
  })

  .controller('HomeController', function($scope, $auth) {
  });

  return 'login';
};