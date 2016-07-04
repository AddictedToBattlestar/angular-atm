'use strict';

angular.module('myApp.main', ['ngRoute', 'draganddrop'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'views/main/main.html',
            controller: 'MainCtrl'
        });
    }])

    .controller('MainCtrl', ['$scope', function () {
        var ctrl = this;
        ctrl.customerAtmCard = {
            'cardType': 'atmCard',
            'cardNumber': 123457898765432
        };

        this.onDrop = function (data, event) {
            console.log('drop works');
            ctrl.isAtmSlotHighlighted = false;
            var insertedCard = data['json/custom-object'];
            if (!insertedCard || insertedCard.cardType !== 'atmCard') return;
            console.log('An ATM card was found to be inserted')
        };
    }]);