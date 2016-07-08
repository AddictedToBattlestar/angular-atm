'use strict';

describe('atm-machine-kata', function() {
    var subject, mockAtmDisplay;

    beforeEach(module('myApp.atmMachineKata'));
    beforeEach(function() {
        mockAtmDisplay = {show: jasmine.createSpy()};

        module(function($provide) {
            $provide.value('atmDisplay', mockAtmDisplay);
        });
    });

    describe('when started', function() {
        beforeEach(function() {
            inject(function($injector) {
                subject = $injector.get('atmMachineKataService');
            });
        });
        
        it('displays a welcome screen ', function() {
            expect(mockAtmDisplay.show).toHaveBeenCalledWith('welcome')
        });
    });
});
