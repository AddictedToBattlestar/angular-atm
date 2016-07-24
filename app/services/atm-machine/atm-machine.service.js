'use strict';

angular.module('myApp.atmMachine', ['myApp.customerAccountApi']).
factory('atmMachineService', ['customerAccountApiService', '$log', function (customerAccountApiService, $log) {
    var service = {};
    service.cardInserted = {};
    service.printerQueue = [];

    var displayChangeCallbacks = [];
    service.registerDisplayChangeCallback = function(callback){
        displayChangeCallbacks.push(callback);
    };

    var showCustomerAtmCardCallbacks = [];
    service.registerShowCustomerAtmCardCallback = function(callback){
        showCustomerAtmCardCallbacks.push(callback);
    };

    //noinspection JSUnresolvedFunction
    service.atmCardInserted = function (card) {
        $log.log('atmMachineService.atmCardInserted');
        service.cardInserted = card;
        changeShowCustomerAtmCard(false);
        if (isValidAtmCard(card)) {
            service.changeDisplay('promptForPin');
        } else {
            ejectCardInserted();
            service.changeDisplay('invalidCardInserted');
        }
    };



    service.keysPressed = 0;
    service.pinEntered = 0;
    service.correctPinEntered = false;
    service.numberPadKeyClick = function (keyPressed) {
        $log.log('The ' + keyPressed + ' key was pressed');
        if (!service.isValidAtmCardInserted()) return;
        if (keyPressed === 'ENTER') {
            service.submitPin(service.pinEntered);
        } else if (keyPressed === 'CLEAR') {
            service.pinEntered = '';
            service.keysPressed = 0;
            service.changeDisplay('promptForPin');
        } else if (keyPressed === 'CANCEL') {
            service.pinEntered = '';
            service.keysPressed = 0;
            service.cancel();
        } else {
            service.processNumberKey(keyPressed);
        }
    };

    service.processNumberKey = function (keyPressed) {
        switch (service.keysPressed) {
            case 0:
                service.pinEntered = keyPressed;
                service.changeDisplay('enterPinNumber-1Character');
                break;
            case 1:
                service.pinEntered = service.pinEntered + keyPressed;
                service.changeDisplay('enterPinNumber-2Characters');
                break;
            case 2:
                service.pinEntered = service.pinEntered + keyPressed;
                service.changeDisplay('enterPinNumber-3Characters');
                break;
            case 3:
                service.pinEntered = service.pinEntered + keyPressed;
                service.changeDisplay('enterPinNumber-Complete');
                service.correctPinEntered = (service.pinEntered === service.cardInserted.PIN);
                break;
        }
        $log.log('PIN entered at present: ' + service.pinEntered);
        service.keysPressed++;
    };


    
    service.submitPin = function (pinNumber) {
        if (pinNumber === service.cardInserted.pin) {
            service.changeDisplay('selectTransaction');
        } else {
            ejectCardInserted();
            service.changeDisplay('invalidPinEntered');
        }
    };

    service.cancel = function () {
        ejectCardInserted();
        service.changeDisplay('welcome');
    };

    service.startWithdrawal = function () {
        service.changeDisplay('selectBalanceOutput');
    };

    service.showAccountBalance = function () {
        //noinspection JSUnresolvedFunction
        var accountBalanceResponse = customerAccountApiService.getBalance(service.cardInserted.accountNumber);
        service.changeDisplay('displayAccountBalance', { accountBalance: accountBalanceResponse.balance});
    };

    service.printAccountBalance = function () {
        //noinspection JSUnresolvedFunction
        var accountBalanceResponse = customerAccountApiService.getBalance(service.cardInserted.accountNumber);
        service.printerQueue.push(accountBalanceResponse);
        service.changeDisplay('welcome');
    };

    service.changeDisplay = function(passedName, passedParams){
        if (!passedParams) passedParams = {};
        angular.forEach(displayChangeCallbacks, function(callback){
            callback(passedName, passedParams);
        });
    };

    service.isValidAtmCardInserted = function() {
        return isValidAtmCard(service.cardInserted);
    };

    function ejectCardInserted() {
        service.cardInserted = {};
        changeShowCustomerAtmCard(true);
    }

    function isValidAtmCard(card) {
        return card && card.type === 'atmCard';
    }

    function changeShowCustomerAtmCard(value) {
        angular.forEach(showCustomerAtmCardCallbacks, function(callback){
            callback(value);
        });
    }

    return service;
}]);