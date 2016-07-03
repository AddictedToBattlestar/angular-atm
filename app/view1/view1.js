'use strict';

angular.module('myApp.view1', ['ngRoute', 'draganddrop'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
        });
    }])

    .controller('View1Ctrl', ['$scope', function ($scope) {
        var selfScope = $scope;
        $scope.isAtmSlotHighlighted = false;

        // Drop handler.
        $scope.onDrop = function (data, event) {
            // Get custom object data.
            // var customObjectData = data['json/custom-object']; // {foo: 'bar'}

            // Get other attached data.
            // var uriList = data['text/uri-list']; // http://mywebsite.com/..
            console.log('drop works');
        };

        $scope.mouseDown = function (event) {
            selfScope.isAtmSlotHighlighted = true;
            console.log('mouseDown works');
        };

        $scope.mouseUp = function (event) {
            selfScope.isAtmSlotHighlighted = false;
            console.log('mouseUp works');
        };
    }]);