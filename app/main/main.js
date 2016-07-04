'use strict';

angular.module('myApp.main', ['ngRoute', 'draganddrop'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/main', {
            templateUrl: 'main/main.html',
            controller: 'MainCtrl'
        });
    }])

    .controller('MainCtrl', ['$scope', function ($scope) {
        var selfScope = $scope;
        $scope.isAtmSlotHighlighted = false;
        $scope.customerAtmCard = {
            'cardType': 'atmCard',
            'cardNumber': 123457898765432
        };

        $scope.onDrop = function (data, event) {
            console.log('drop works');
            selfScope.isAtmSlotHighlighted = false;
            var insertedCard = data['json/custom-object'];
            if (!insertedCard || insertedCard.cardType !== 'atmCard') return;
            console.log('An ATM card was found to be inserted')
        };
    }]);