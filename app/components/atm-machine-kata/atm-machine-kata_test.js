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
    var mockAtmDisplay, mockAtmCardSlot, mockAtmPrinter, mockCustomerAccountApi;
    var fakeAtmCard, fakeAccountBalanceResponse;

    beforeEach(module('myApp.atmMachineKata'));
    beforeEach(function () {
        initMocksAndFakes();

        module(function ($provide) {
            $provide.value('atmDisplay', mockAtmDisplay);
            $provide.value('atmCardSlot', mockAtmCardSlot);
            $provide.value('atmPrinter', mockAtmPrinter);
            $provide.value('customerAccountApi', mockCustomerAccountApi);
        });
    });

    when('started', function () {
        beforeEach(function () {
            inject(function ($injector) {
                subject = $injector.get('atmMachineKataService');
            });
        });

        it('displays a welcome screen', function () {
            expect(mockAtmDisplay.show).toHaveBeenCalledWith('welcome')
        });

        when('an ATM card is inserted', function () {
            beforeEach(function () {
                mockAtmDisplay.show.calls.reset();
                subject.atmCardInserted(fakeAtmCard);
            });

            it('shows a prompt to the customer asking them to input their PIN number', function () {
                expect(mockAtmDisplay.show).toHaveBeenCalledWith('promptForPin');
            });

            and('an invalid card is inserted', function () {
                var fakeUnRecognizedCard = {
                    someRandomKey: 'someRandomValue'
                };
                beforeEach(function () {
                    mockAtmDisplay.show.calls.reset();
                    subject.atmCardInserted(fakeUnRecognizedCard);
                });

                it('shows a message stating that the card is not valid', function () {
                    expect(mockAtmDisplay.show).toHaveBeenCalledWith('invalidCardInserted');
                });

                it('returns the inserted card back to the customer', function () {
                    expect(mockAtmCardSlot.ejectCard).toHaveBeenCalledWith(fakeUnRecognizedCard);
                });
            });

            and('the correct PIN number is entered', function () {
                beforeEach(function () {
                    mockAtmDisplay.show.calls.reset();
                    subject.submitPin(fakeAtmCard.pin);
                });

                it('shows a screen with transactions that are allowed', function () {
                    expect(mockAtmDisplay.show).toHaveBeenCalledWith('selectTransaction');
                });
            });

            and('the wrong PIN number is entered', function () {
                beforeEach(function () {
                    mockAtmDisplay.show.calls.reset();
                    subject.submitPin(1111);
                });

                it('show a screen with transactions that are allowed', function () {
                    expect(mockAtmDisplay.show).toHaveBeenCalledWith('invalidPinEntered');
                });

                it('returns the inserted card back to the customer', function () {
                    expect(mockAtmCardSlot.ejectCard).toHaveBeenCalledWith(fakeAtmCard);
                });
            });
        });

        when('the transaction screen is shown', function () {
            beforeEach(function () {
                mockAtmDisplay.show.calls.reset();
                subject.atmCardInserted(fakeAtmCard);
            });

            and('the customer selects "cancel"', function () {
                beforeEach(function () {
                    subject.cancel();
                });

                it('returns the inserted card back to the customer', function () {
                    expect(mockAtmCardSlot.ejectCard).toHaveBeenCalledWith(fakeAtmCard);
                });

                it('displays a welcome screen ', function () {
                    expect(mockAtmDisplay.show).toHaveBeenCalledWith('welcome')
                });
            });

            and('the customer selects "account balance"', function () {
                beforeEach(function () {
                    subject.startWithdrawal();
                });

                it('displays a screen asking how they would like their balance provided', function () {
                    expect(mockAtmDisplay.show).toHaveBeenCalledWith('selectBalanceOutput');
                });

                when('selecting to have their account balance shown on the screen', function() {
                    beforeEach(function() {
                        mockAtmDisplay.show.calls.reset();
                        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
                        mockCustomerAccountApi.getBalance.and.returnValue(fakeAccountBalanceResponse);
                        subject.showAccountBalance();
                    });

                    it('requests the customers account balance from the api', function() {
                        //noinspection JSUnresolvedVariable
                        expect(mockCustomerAccountApi.getBalance).toHaveBeenCalledWith(fakeAtmCard.accountNumber);
                    });

                    it('then displays the customers account balance', function () {
                        expect(mockAtmDisplay.show).toHaveBeenCalledWith('displayAccountBalance', 99.25);
                    });
                });

                when('selecting to have their account balance printed', function() {
                    beforeEach(function() {
                        mockAtmDisplay.show.calls.reset();
                        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
                        mockCustomerAccountApi.getBalance.and.returnValue(fakeAccountBalanceResponse);
                        subject.printAccountBalance();
                    });

                    it('requests the customers account balance from the api', function() {
                        //noinspection JSUnresolvedVariable
                        expect(mockCustomerAccountApi.getBalance).toHaveBeenCalledWith(fakeAtmCard.accountNumber);
                    });

                    it('displays a welcome screen', function () {
                        expect(mockAtmDisplay.show).toHaveBeenCalledWith('welcome')
                    });

                    it('prints the account balance for the customer', function() {
                       expect(mockAtmPrinter.printBalance).toHaveBeenCalledWith(fakeAccountBalanceResponse)
                    });
                });
            });
        });
    });

    function initMocksAndFakes() {
        mockAtmDisplay = {show: jasmine.createSpy()};
        mockAtmCardSlot = {ejectCard: jasmine.createSpy()};
        mockAtmPrinter = {printBalance: jasmine.createSpy()};
        mockCustomerAccountApi = jasmine.createSpyObj('customerAccountApi', ['getBalance']);
        fakeAtmCard = {
            type: 'atmCard',
            pin: 1234,
            accountNumber: 1234567890
        };
        fakeAccountBalanceResponse = {
            customerName: 'Joe Smith',
            accountNumber: 1234567890,
            balance: 99.25
        }
    }
});
