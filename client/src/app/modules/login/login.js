'use strict';

const name = 'login';

import loginTemplate from './login.html';
import loginModal from './login-modal.html';
import angular from 'angular';

angular.module(name, ['ui.router'])

.config(function($stateProvider) {
  $stateProvider.state(name, {
    url         : '/login',
    template    : loginTemplate,
    controller  : 'LoginController'
  });
})

.controller('LoginController', function($scope, $uibModal) {
  $scope.open = function() {
    var modalInstance = $uibModal.open({
      animation   : true,
      template    : loginModal,
      controller  : 'LoginModalController',
      size        : 'sm',
      backdrop    : false,
      keyboard    : false
    });
  };

  setTimeout(() => {
    $scope.open();
  }, 500);

})

.controller('LoginModalController', function($scope, $auth, $location, $uibModalInstance) {

  $scope.user = {};

  $scope.closeModal = function () {
    $uibModalInstance.close();
  };

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
