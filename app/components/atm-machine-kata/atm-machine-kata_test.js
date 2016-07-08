'use strict';

describe('atm-machine-kata', function() {
    var subject, mockAtmDisplay;

    beforeEach(module('myApp.atmMachineKata'));
    beforeEach(function() {
        mockAtmDisplay = {show: jasmine.createSpy()};

        module(function($provide) {
            $provide.value('atmDisplay', mockAtmDisplay);
        });

        inject(function($injector) {
            subject = $injector.get('atmMachineKataService');
        });
    });

    describe('when started', function() {


        it('displays a welcome screen ', function() {
            expect(mockAtmDisplay.show).toHaveBeenCalledWith('welcome')
        });
    });
});
