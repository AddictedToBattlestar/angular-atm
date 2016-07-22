'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'ngMaterial',
    'draganddrop',
    'myApp.main',
    'myApp.about',
    'myApp.version',
    'myApp.customerAccountApi',
    'myApp.atmMachine',
    'myApp.atmDisplay',
    'myApp.keyPad',
    'myApp.atmSlot',
    'myApp.displayButtonPanel'
]).config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.otherwise({redirectTo: '/'});
}]);
