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