'use strict';

angular.
module('myApp.keyPad').
component('keyPad', {
    templateUrl: 'components/key-pad/key-pad.template.html',
    controller: function() {
    },
    bindings: {
        keyPress: '&'
    }
});