'use strict';

angular.
module('myApp.atmDisplay').
component('atmDisplay', {
    templateUrl: 'components/atm-display/atm-display.template.html',
    controller: function AtmDisplayController($http) {
        var ctrl = this;
        ctrl.currentDisplay = '';

        ctrl.$onInit = function() {
            ctrl.currentDisplay = 'welcome';
        };

        $http.get('api/displays.json').then(function(response) {
            ctrl.availableDisplays = response.data;
        });
    },
    bindings: {
        currentDisplay: '<'
    }
});