'use strict';

module.exports = function (angular, uiRouter) {

  var name = 'login';

  angular.module(name, [uiRouter])
  // $urlRouterProvider
  .config(function($stateProvider) {
    $stateProvider.state('login', {
      url         : '/login',
      templateUrl : '/templates/login.html',
      controller  : 'LoginController'
    });
  })
  .controller('LoginController', function() {
    // $scope, $state
    console.log('login controllersi');
    console.log("there some logs here");
  });

  return 'login';
};