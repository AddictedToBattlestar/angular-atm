'use strict';

angular.
module('myApp.keyPad').
component('keyPad', {
    templateUrl: 'components/key-pad/key-pad.template.html',
    controller: function() {
        var ctrl = this;
        ctrl.keyPress = function(keyPressed) {
            ctrl.processNumberPadKeyPress({'keyPressed': keyPressed});
        }
    },
    bindings: {
        processNumberPadKeyPress: '&'
    }
});