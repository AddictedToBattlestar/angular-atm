'use strict';


var sugarFn = function (term) {
    return function (desc, fn) {
        return describe(term + ' ' + desc, fn);
    };
};
var when = sugarFn('when');

describe('atm-machine-kata', function() {
    var subject, mockAtmDisplay;

    beforeEach(module('myApp.atmMachineKata'));
    beforeEach(function() {
        mockAtmDisplay = {show: jasmine.createSpy()};

        module(function($provide) {
            $provide.value('atmDisplay', mockAtmDisplay);
        });
    });

    when('started', function() {
        beforeEach(function() {
            inject(function($injector) {
                subject = $injector.get('atmMachineKataService');
            });
        });
        
        it('displays a welcome screen ', function() {
            expect(mockAtmDisplay.show).toHaveBeenCalledWith('welcome')
        });

        when('an ATM card is inserted', function() {
            var testAtmCard = {
                type: 'atmCard'
            };

            beforeEach(function() {
                mockAtmDisplay.show.calls.reset();
                subject.atmCardInserted(testAtmCard);
            });
            
            it('shows a prompt to the customer asking them to input their PIN number', function() {
                expect(mockAtmDisplay.show).toHaveBeenCalledWith('promptForPin');
            });
        });

        when('an unrecognized card is inserted', function() {
            var testUnRecognizedCard = {
                someRandomKey: 'someRandomValue'
            };

            beforeEach(function() {
                mockAtmDisplay.show.calls.reset();
                subject.atmCardInserted(testUnRecognizedCard);
            });

            it('shows a message stating that the card is not ', function() {
                expect(mockAtmDisplay.show).toHaveBeenCalledWith('invalidCardInserted');
            });
        })

    });
});
