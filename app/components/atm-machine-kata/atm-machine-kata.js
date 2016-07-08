angular.
module('myApp.atmMachineKata', []).
factory('atmMachineKataService', ['atmDisplay', 'atmCardSlot', 'customerAccountApi',  function(atmDisplay, atmCardSlot, customerAccountApi) {
    var service = this;
    service.cardInserted = {};
    atmDisplay.show('welcome');

    service.atmCardInserted = function(card) {
        service.cardInserted = card;
        if(isValidAtmCard(card)) {
            atmDisplay.show('promptForPin');
        } else {
            ejectCardInserted();
            atmDisplay.show('invalidCardInserted');
        }
    };

    service.submitPin = function(pinNumber) {
        if(pinNumber === service.cardInserted.pin) {
            atmDisplay.show('selectTransaction');
        } else {
            ejectCardInserted();
            atmDisplay.show('invalidPinEntered');
        }
    };

    service.cancel = function() {
        ejectCardInserted();
        atmDisplay.show('welcome');
    };

    service.startWithdrawal = function() {
        atmDisplay.show('selectBalanceOutput');
    };
    
    service.showAccountBalance = function() {
      //noinspection JSUnresolvedFunction
        var accountBalance = customerAccountApi.getBalance(service.cardInserted.accountNumber);
        atmDisplay.show('displayAccountBalance', accountBalance);
    };

    function ejectCardInserted() {
        atmCardSlot.ejectCard(service.cardInserted);
        service.cardInserted = {};
    }
    function isValidAtmCard(card) {
        return card && card.type === 'atmCard';
    }

    return service;
}]);