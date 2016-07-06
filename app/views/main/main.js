'use strict';

angular.module('myApp.main', ['ngRoute', 'draganddrop'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'views/main/main.html',
            controller: 'MainCtrl'
        });
    }])

    .controller('MainCtrl', [function () {
        var ctrl = this;
        ctrl.customerAtmCard = {
            'cardType': 'atmCard',
            'cardNumber': 123457898765432
        };
        ctrl.showCustomerAtmCard = true;
        ctrl.currentDisplay = '';
        
        ctrl.onDrop = function (data, event) {
            console.log('drop works');
            var insertedCard = data['json/custom-object'];
            if (!insertedCard || insertedCard.cardType !== 'atmCard') return;
            console.log('An ATM card was found to be inserted')
            ctrl.currentDisplay = 'enterPinNumber';
            ctrl.showCustomerAtmCard = false;
        };
    }]);