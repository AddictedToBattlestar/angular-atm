'use strict';

angular.module('myApp.about', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/about', {
    templateUrl: 'views/about/about.html',
    controller: 'AboutCtrl'
  });
}])

.controller('AboutCtrl', ['$scope', function($scope) {
    $scope.testMessage = 'cock swizzler';
}]);