'use strict';

angular.module('myApp.displayButtonPanel', []).
component('displayButtonPanel', {
    templateUrl: 'components/display-button-panel/display-button-panel.template.html',
    controller: function() {
    },
    bindings: {
        keyPress: '&'
    }
});