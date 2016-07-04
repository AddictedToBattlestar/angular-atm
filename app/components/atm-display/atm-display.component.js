'use strict';

angular.
module('myApp.atmDisplay').
component('atmDisplay', {
    templateUrl: 'components/atm-display/atm-display.template.html',
    controller: function AtmDisplayController($http) {
        var ctrl = this;

        $http.get('api/displays.json').then(function(response) {
            ctrl.availableDisplays = response.data;
            ctrl.currentDisplay = response.data["welcome"];
        });
    }
});