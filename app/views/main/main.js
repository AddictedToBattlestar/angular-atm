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

        ctrl.keysPressed = 0;
        ctrl.pinEntered = 0;
        ctrl.correctPinEntered = false;
        ctrl.numberPadKeyClick = function (keyPressed) {
            $log.log('The ' + keyPressed + ' key was pressed');
            if (!atmMachineService.isValidAtmCardInserted()) return;
            if (keyPressed === 'ENTER') {
                ctrl.enterButtonClick();
            } else if (keyPressed === 'CLEAR') {
                ctrl.pinEntered = '';
                ctrl.keysPressed = 0;
                atmMachineService.changeDisplay('promptForPin');
            } else if (keyPressed === 'CANCEL') {
                ctrl.pinEntered = '';
                ctrl.keysPressed = 0;
                atmMachineService.cancel();
            } else {
                ctrl.processNumberKey(keyPressed);
            }
        };

        ctrl.displayButtonLeftKeyClick = function (keyPressed) {
            $log.log('The ' + keyPressed + ' left display button was pressed');
        };

        ctrl.displayButtonRightKeyClick = function (keyPressed) {
            $log.log('The ' + keyPressed + ' right display button was pressed');
        };

        ctrl.processNumberKey = function (keyPressed) {
            switch (ctrl.keysPressed) {
                case 0:
                    ctrl.pinEntered = keyPressed;
                    atmMachineService.changeDisplay('enterPinNumber-1Character');
                    break;
                case 1:
                    ctrl.pinEntered = ctrl.pinEntered + keyPressed;
                    atmMachineService.changeDisplay('enterPinNumber-2Characters');
                    break;
                case 2:
                    ctrl.pinEntered = ctrl.pinEntered + keyPressed;
                    atmMachineService.changeDisplay('enterPinNumber-3Characters');
                    break;
                case 3:
                    ctrl.pinEntered = ctrl.pinEntered + keyPressed;
                    atmMachineService.changeDisplay('enterPinNumber-Complete');
                    ctrl.correctPinEntered = (ctrl.pinEntered === atmMachineService.cardInserted.PIN);
                    break;
            }
            $log.log('PIN entered at present: ' + ctrl.pinEntered);
            ctrl.keysPressed++;
        };

        ctrl.enterButtonClick = function () {
            atmMachineService.submitPin(ctrl.pinEntered);
        };
    }]);