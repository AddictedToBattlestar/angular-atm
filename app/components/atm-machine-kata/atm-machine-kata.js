angular.
module('myApp.atmMachineKata', []).
factory('atmMachineKataService', ['atmDisplay', function(atmDisplay) {
    var service = this;
    atmDisplay.show('welcome');
    service.atmCardInserted = function(atmCard) {
        atmDisplay.show(isValidAtmCard(atmCard) ? 'promptForPin' : 'invalidCardInserted');
    };

    function isValidAtmCard(card) {
        return card && card.type === 'atmCard';
    }
    return service;
}]);