const name = 'app.services.user';

import angular from 'angular';

angular.module(name, ['ngResource'])

.factory('UserFactory', ['$resource', function ($resource) {
  return $resource('/users/', {}, {
    query: { method: 'GET', isArray: true }
  });
}])

export default name;