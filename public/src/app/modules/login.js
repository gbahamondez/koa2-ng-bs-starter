'use strict';

module.exports = function (angular, uiRouter) {

  var name = 'login';

  angular.module(name, [uiRouter])

  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('login', {
      url         : '/login',
      templateUrl : '/templates/login.html',
      controller  : 'LoginController'
    });
  })

  .controller('LoginController', function($scope, $state) {
    console.log('login controller');
  });

  return 'login';
};