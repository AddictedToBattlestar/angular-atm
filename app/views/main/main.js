'use strict';

angular.module('myApp.main', ['ngRoute', 'draganddrop', 'myApp.atmMachine'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'views/main/main.html',
            controller: 'MainCtrl'
        });
    }])

    .controller('MainCtrl', ['$scope', '$log', 'atmMachineService', function ($scope, $log, atmMachineService) {
        var ctrl = $scope;
        ctrl.customerAtmCard = {
            'type': 'atmCard',
            'cardNumber': 123457898765432,
            'pin': '1234'
        };
        ctrl.showCustomerAtmCard = true;
        atmMachineService.registerShowCustomerAtmCardCallback(function (value) {
            $log.log('showCustomerAtmCard changed to ' + value);
            ctrl.showCustomerAtmCard = value;
        });

        ctrl.processCardInserted = function (data, event) {
            var insertedCard = data['json/custom-object'];
            atmMachineService.atmCardInserted(insertedCard);
        };

        ctrl.displayButtonLeftKeyClick = function (keyPressed) {
            $log.log('The ' + keyPressed + ' left display button was pressed');
        };

        ctrl.displayButtonRightKeyClick = function (keyPressed) {
            $log.log('The ' + keyPressed + ' right display button was pressed');
        };

        ctrl.numberPadKeyClick = atmMachineService.numberPadKeyClick;

    }]);