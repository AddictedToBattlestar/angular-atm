'use strict';


var sugarFn = function (term) {
    return function (desc, fn) {
        return describe(term + ' ' + desc, fn);
    };
};
var when = sugarFn('when');
var and = sugarFn('and');

describe('atm-machine-kata', function () {
    var subject;
    var mockAtmDisplay, mockAtmCardSlot;

    beforeEach(module('myApp.atmMachineKata'));
    beforeEach(function () {
        mockAtmDisplay = {show: jasmine.createSpy()};
        mockAtmCardSlot = {ejectCard: jasmine.createSpy()};

        module(function ($provide) {
            $provide.value('atmDisplay', mockAtmDisplay);
            $provide.value('atmCardSlot', mockAtmCardSlot);
        });
    });

    when('started', function () {
        beforeEach(function () {
            inject(function ($injector) {
                subject = $injector.get('atmMachineKataService');
            });
        });

        it('displays a welcome screen ', function () {
            expect(mockAtmDisplay.show).toHaveBeenCalledWith('welcome')
        });

        when('an ATM card is inserted', function () {
            var testAtmCard = {
                type: 'atmCard',
                pin: 1234
            };
            beforeEach(function () {
                mockAtmDisplay.show.calls.reset();
                subject.atmCardInserted(testAtmCard);
            });

            it('shows a prompt to the customer asking them to input their PIN number', function () {
                expect(mockAtmDisplay.show).toHaveBeenCalledWith('promptForPin');
            });

            and('an invalid card is inserted', function () {
                var testUnRecognizedCard = {
                    someRandomKey: 'someRandomValue'
                };
                beforeEach(function () {
                    mockAtmDisplay.show.calls.reset();
                    subject.atmCardInserted(testUnRecognizedCard);
                });

                it('shows a message stating that the card is not valid', function () {
                    expect(mockAtmDisplay.show).toHaveBeenCalledWith('invalidCardInserted');
                });

                it('returns the inserted card back to the customer', function() {
                    expect(mockAtmCardSlot.ejectCard).toHaveBeenCalledWith(testUnRecognizedCard);
                });
            });

            and('the correct PIN number is entered', function () {
                var pinNumber = 1234;
                beforeEach(function() {
                    mockAtmDisplay.show.calls.reset();
                    subject.submitPin(pinNumber);
                });
                
                it('shows a screen with transactions that are allowed', function() {
                    expect(mockAtmDisplay.show).toHaveBeenCalledWith('selectTransaction');
                });
            });

            and('the wrong PIN number is entered', function () {
                var pinNumber = 1111;
                beforeEach(function() {
                    mockAtmDisplay.show.calls.reset();
                    subject.submitPin(pinNumber);
                });

                it('show a screen with transactions that are allowed', function() {
                    expect(mockAtmDisplay.show).toHaveBeenCalledWith('invalidPinEntered');
                });

                it('returns the inserted card back to the customer', function() {
                    expect(mockAtmCardSlot.ejectCard).toHaveBeenCalledWith(testAtmCard);
                });
            });
        });

        when('the transaction screen is shown', function() {
            var testAtmCard = {
                type: 'atmCard',
                pin: 1234
            };
            beforeEach(function() {
                mockAtmDisplay.show.calls.reset();
                subject.atmCardInserted(testAtmCard);
            });
            
            and('the customer selects cancel', function () {
               beforeEach(function() {
                   subject.cancel();
               });

                it('returns the inserted card back to the customer', function() {
                    expect(mockAtmCardSlot.ejectCard).toHaveBeenCalledWith(testAtmCard);
                });

                it('displays a welcome screen ', function () {
                    expect(mockAtmDisplay.show).toHaveBeenCalledWith('welcome')
                });
            });
        });

    });
});
