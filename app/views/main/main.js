'use strict';

angular.module('myApp.main', ['ngRoute', 'draganddrop', 'myApp.atmMachine'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'views/main/main.html',
            controller: 'MainCtrl'
        });
    }])

    .controller('MainCtrl', ['$scope', 'atmMachineService', function ($scope, atmMachineService) {
        var ctrl = $scope;
        ctrl.customerAtmCard = {
            'type': 'atmCard',
            'cardNumber': 123457898765432,
            'pin': '1234'
        };
        ctrl.showCustomerAtmCard = true;
        atmMachineService.registerShowCustomerAtmCardCallback(function(value) {
            console.log('showCustomerAtmCard changed to '+ value);
            ctrl.showCustomerAtmCard = value;
        });

        ctrl.processCardInserted = function (data, event) {
            console.log('drop works');
            var insertedCard = data['json/custom-object'];
            atmMachineService.atmCardInserted(insertedCard);
        };

        ctrl.keysPressed = 0;
        ctrl.pinEntered = 0;
        ctrl.correctPinEntered = false;
        ctrl.numberPadKeyClick = function (keyPressed) {
            console.log('A key press of ' + keyPressed + ' was registered');
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
            console.log('PIN entered at present: ' + ctrl.pinEntered);
            ctrl.keysPressed++;
        };

        ctrl.enterButtonClick = function () {
            atmMachineService.submitPin(ctrl.pinEntered);
        };
    }]);