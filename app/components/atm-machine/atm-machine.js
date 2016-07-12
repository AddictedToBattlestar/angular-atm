angular.module('myApp.atmMachine', []).factory('atmMachineService', ['atmCardSlot', 'atmPrinter', 'customerAccountApi', function (atmCardSlot, atmPrinter, customerAccountApi) {
    var service = this;
    var cardInserted = {};

    service.currentlyDisplayed = {
        name: 'welcome',
        params: {}
    };
    
    //noinspection JSUnresolvedFunction
    atmCardSlot.subscribeToAtmCardInserted(function (card) {
        cardInserted = card;
        if (isValidAtmCard(card)) {
            service.currentlyDisplayed.name = 'promptForPin';
        } else {
            ejectCardInserted();
            service.currentlyDisplayed.name = 'invalidCardInserted';
        }
    });

    service.submitPin = function (pinNumber) {
        if (pinNumber === cardInserted.pin) {
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
        var accountBalanceResponse = customerAccountApi.getBalance(cardInserted.accountNumber);
        service.currentlyDisplayed = {
            name: 'displayAccountBalance',
            params: {
                accountBalance: accountBalanceResponse.balance
            }
        };
    };

    service.printAccountBalance = function () {
        //noinspection JSUnresolvedFunction
        var accountBalanceResponse = customerAccountApi.getBalance(cardInserted.accountNumber);
        atmPrinter.printBalance(accountBalanceResponse);
        service.currentlyDisplayed.name = 'welcome';
    };

    function ejectCardInserted() {
        atmCardSlot.ejectCard(cardInserted);
        cardInserted = {};
    }

    function isValidAtmCard(card) {
        return card && card.type === 'atmCard';
    }

    return service;
}]);