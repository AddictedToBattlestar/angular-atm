'use strict';

angular.
module('myApp.atmDisplay').
component('atmDisplay', {
    templateUrl: 'components/atm-display/atm-display.template.html',
    controller: function AtmDisplayController($http) {
        var self = this;

        $http.get('api/displays.json').then(function(response) {
            self.availableDisplays = response.data;
            self.currentDisplay = response.data["welcome"];
        });
    }
});