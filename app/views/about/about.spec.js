'use strict';

describe('myApp.about module', function () {
    var scope;

        beforeEach(function() {
            module('myApp.about');
            scope = {
                testMessage: ''
            };
        });

    describe('about controller', function () {

        it('should ....', inject(function ($controller) {
            //spec body
            var aboutCtrl = $controller('AboutCtrl', {
                $scope: scope
            });
            expect(aboutCtrl).toBeDefined();
        }));

    });
});