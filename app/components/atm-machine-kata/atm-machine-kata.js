angular.
module('myApp.atmMachineKata', []).
factory('atmMachineKataService', ['atmDisplay', function(atmDisplay) {
    var service = this;
    atmDisplay.show('welcome');
    return service;
}]);