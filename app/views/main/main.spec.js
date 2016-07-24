'use strict';

describe('myApp.main module', function () {
    describe('MainCtrl controller', function() {
        var subject, scope;
        var mockAtmMachineService;

        beforeEach(function(){
            module('myApp.atmMachine');
            module('myApp.main');
        });
        beforeEach(inject(function($rootScope, $controller) {
            scope = $rootScope.$new();
            initMocksAndFakes();

            subject = $controller('MainCtrl', {
                $scope: scope,
                atmMachineService: mockAtmMachineService
            });
        }));

        describe('main controller', function () {

            it('should ....', inject(function ($controller) {
                //spec body
                expect(subject).toBeDefined();
            }));

        });

        function initMocksAndFakes() {
            mockAtmMachineService = jasmine.createSpyObj('atmMachineService', [
                'cardInserted',
                'printerQueue',
                'registerDisplayChangeCallback',
                'registerShowCustomerAtmCardCallback',
                'atmCardInserted',
                'numberPadKeyClick',
                'submitPin',
                'cancel',
                'startWithdrawal',
                'showAccountBalance',
                'printAccountBalance',
                'changeDisplay',
                'isValidAtmCardInserted'
            ]);
        }
    });
});