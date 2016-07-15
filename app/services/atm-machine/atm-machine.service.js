'use strict';
//  atmCardSlot:
//      --> atmCardInserted(card)
//      <-- cardInserted (null)

//  atmPrinter
//      <-- printerQueue (array to pop once printed)

//  customerAccountApi
//      getBalance(accountNumber);

angular.module('myApp.atmMachine', ['myApp.customerAccountApi']).
factory('atmMachineService', ['customerAccountApiService', function (customerAccountApiService) {
    var service = {};
    service.cardInserted = {};
    service.printerQueue = [];
    service.currentlyDisplayed = {
        name: 'welcome',
        params: {}
    };

    //noinspection JSUnresolvedFunction
    service.atmCardInserted = function (card) {
        service.cardInserted = card;
        if (isValidAtmCard(card)) {
            service.currentlyDisplayed.name = 'promptForPin';
        } else {
            ejectCardInserted();
            service.currentlyDisplayed.name = 'invalidCardInserted';
        }
    };

    service.submitPin = function (pinNumber) {
        if (pinNumber === service.cardInserted.pin) {
            service.currentlyDisplayed.name = 'selectTransaction';
        } else {
            ejectCardInserted();
            service.currentlyDisplayed.name = 'invalidPinEntered';
        }
    };

    service.cancel = function () {
        ejectCardInserted();
        service.currentlyDisplayed.name = 'welcome';
    };

    service.startWithdrawal = function () {
        service.currentlyDisplayed.name = 'selectBalanceOutput';
    };

    service.showAccountBalance = function () {
        //noinspection JSUnresolvedFunction
        var accountBalanceResponse = customerAccountApiService.getBalance(service.cardInserted.accountNumber);
        service.currentlyDisplayed = {
            name: 'displayAccountBalance',
            params: {
                accountBalance: accountBalanceResponse.balance
            }
        };
    };

    service.printAccountBalance = function () {
        //noinspection JSUnresolvedFunction
        var accountBalanceResponse = customerAccountApiService.getBalance(service.cardInserted.accountNumber);
        service.printerQueue.push(accountBalanceResponse);
        service.currentlyDisplayed.name = 'welcome';
    };

    function ejectCardInserted() {
        service.cardInserted = {};
    }

    function isValidAtmCard(card) {
        return card && card.type === 'atmCard';
    }

    return service;
}]);