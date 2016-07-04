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