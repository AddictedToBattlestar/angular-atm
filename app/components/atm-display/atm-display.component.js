'use strict';

angular.module('myApp.atmDisplay', ['myApp.atmMachine']).
component('atmDisplay', {
    templateUrl: 'components/atm-display/atm-display.template.html',
    controller: function AtmDisplayController($http, $log, atmMachineService) {
        var ctrl = this;
        ctrl.currentDisplay = '';

        atmMachineService.registerDisplayChangeCallback(function(displayName, params) {
            $log.log('display changed to "'+ displayName +'"');
            ctrl.currentDisplay = displayName;
        });

        ctrl.$onInit = function() {
            ctrl.currentDisplay = 'welcome';
        };

        $http.get('api/displays.json').then(function(response) {
            ctrl.availableDisplays = response.data;
        });
    }
});