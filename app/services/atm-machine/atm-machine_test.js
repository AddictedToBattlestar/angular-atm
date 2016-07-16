'use strict';

var sugarFn = function (term) {
    return function (desc, fn) {
        return describe(term + ' ' + desc, fn);
    };
};
var when = sugarFn('when');
var and = sugarFn('and');

describe('atm-machine', function () {
    var subject;
    var mockCustomerAccountApiService, mockAtmPrinter;
    var fakeAtmCard, fakeAccountBalanceResponse;
    var displayChangeCallbackSpy, showCustomerAtmCardCallbackSpy;

    beforeEach(module('myApp.atmMachine'));
    beforeEach(function () {
        initMocksAndFakes();

        module(function ($provide) {
            $provide.value('customerAccountApiService', mockCustomerAccountApiService);
        });
    });

    when('started', function () {
        beforeEach(function () {
            inject(function ($injector) {
                displayChangeCallbackSpy  = jasmine.createSpy('displayChangeCallbackSpy');
                showCustomerAtmCardCallbackSpy  = jasmine.createSpy('showCustomerAtmCardCallbackSpy');

                subject = $injector.get('atmMachineService');
                subject.registerDisplayChangeCallback(displayChangeCallbackSpy);
                subject.registerShowCustomerAtmCardCallback(showCustomerAtmCardCallbackSpy);
            });
        });

        when('an ATM card is inserted', function () {
            beforeEach(function () {
                displayChangeCallbackSpy.calls.reset();
                subject.atmCardInserted(fakeAtmCard);
            });

            it('shows a prompt to the customer asking them to input their PIN number', function () {
                expect(displayChangeCallbackSpy).toHaveBeenCalledWith('promptForPin', jasmine.any(Object));
            });

            and('an invalid card is inserted', function () {
                var fakeUnRecognizedCard = {
                    someRandomKey: 'someRandomValue'
                };
                beforeEach(function () {
                    displayChangeCallbackSpy.calls.reset();
                    subject.atmCardInserted(fakeUnRecognizedCard);
                });

                it('shows a message stating that the card is not valid', function () {
                    expect(displayChangeCallbackSpy).toHaveBeenCalledWith('invalidCardInserted', jasmine.any(Object));
                });

                it('returns the inserted card back to the customer', function () {
                    expect(subject.cardInserted).toEqual({});
                });
            });

            and('the correct PIN number is entered', function () {
                beforeEach(function () {
                    displayChangeCallbackSpy.calls.reset();
                    subject.submitPin(fakeAtmCard.pin);
                });

                it('shows a screen with transactions that are allowed', function () {
                    expect(displayChangeCallbackSpy).toHaveBeenCalledWith('selectTransaction', jasmine.any(Object));
                });
            });

            and('the wrong PIN number is entered', function () {
                beforeEach(function () {
                    displayChangeCallbackSpy.calls.reset();
                    subject.submitPin(1111);
                });

                it('show a screen with transactions that are allowed', function () {
                    expect(displayChangeCallbackSpy).toHaveBeenCalledWith('invalidPinEntered', jasmine.any(Object));
                });

                it('returns the inserted card back to the customer', function () {
                    expect(subject.cardInserted).toEqual({});
                });
            });
        });

        when('the transaction screen is shown', function () {
            beforeEach(function () {
                subject.atmCardInserted(fakeAtmCard);
            });

            and('the customer selects "cancel"', function () {
                beforeEach(function () {
                    displayChangeCallbackSpy.calls.reset();
                    subject.cancel();
                });

                it('returns the inserted card back to the customer', function () {
                    expect(subject.cardInserted).toEqual({});
                });

                it('displays a welcome screen ', function () {
                    expect(displayChangeCallbackSpy).toHaveBeenCalledWith('welcome', jasmine.any(Object));
                });
            });

            and('the customer selects "account balance"', function () {
                beforeEach(function () {
                    displayChangeCallbackSpy.calls.reset();
                    subject.startWithdrawal();
                });

                it('displays a screen asking how they would like their balance provided', function () {
                    expect(displayChangeCallbackSpy).toHaveBeenCalledWith('selectBalanceOutput', jasmine.any(Object));

                });

                when('selecting to have their account balance shown on the screen', function () {
                    beforeEach(function () {
                        displayChangeCallbackSpy.calls.reset();
                        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
                        mockCustomerAccountApiService.getBalance.and.returnValue(fakeAccountBalanceResponse);
                        subject.showAccountBalance();
                    });

                    it('requests the customers account balance from the api', function () {
                        //noinspection JSUnresolvedVariable
                        expect(mockCustomerAccountApiService.getBalance).toHaveBeenCalledWith(fakeAtmCard.accountNumber);
                    });

                    it('then displays the customers account balance', function () {
                        expect(displayChangeCallbackSpy).toHaveBeenCalledWith('displayAccountBalance', {accountBalance: 99.25});
                    });
                });

                when('selecting to have their account balance printed', function () {
                    beforeEach(function () {
                        subject.printerQueue = [];
                        displayChangeCallbackSpy.calls.reset();
                        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
                        mockCustomerAccountApiService.getBalance.and.returnValue(fakeAccountBalanceResponse);

                        subject.printAccountBalance();
                    });

                    it('requests the customers account balance from the api', function () {
                        //noinspection JSUnresolvedVariable
                        expect(mockCustomerAccountApiService.getBalance).toHaveBeenCalledWith(fakeAtmCard.accountNumber);
                    });

                    it('displays a welcome screen', function () {
                        expect(displayChangeCallbackSpy).toHaveBeenCalledWith('welcome', jasmine.any(Object));
                    });

                    it('prints the account balance for the customer', function () {
                        expect(subject.printerQueue[0]).toEqual(fakeAccountBalanceResponse);
                    });
                });
            });
        });
    });

    function initMocksAndFakes() {
        mockAtmPrinter = {printBalance: jasmine.createSpy()};
        mockCustomerAccountApiService = jasmine.createSpyObj('customerAccountApiService', ['getBalance']);
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
