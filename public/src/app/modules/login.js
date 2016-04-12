'use strict';

module.exports = function (angular, uiRouter) {

  var name = 'login';

  angular.module(name, [uiRouter])

  .config(function($stateProvider) {
    $stateProvider.state('login', {
      url         : '/login',
      templateUrl : '/templates/login.html',
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
        // console.log(data);
        $location.path('/tuhermana');
      })
      .catch(function(err) {
        console.log(err);
      });
    };
  });

  return 'login';
};