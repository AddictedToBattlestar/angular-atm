'use strict';

describe('myApp.main module', function () {
    describe('MainCtrl controller', function() {
        var subject, $scope;
        var mockAtmMachineService;

        beforeEach(function(){
            module('myApp.main');
            inject( function($injector){
                mockAtmMachineService = $injector.get('atm-machine-service');
                subject = $injector.get('$controller');
                $scope = $injector.get('$scope');
            });
        });


        beforeEach(inject(function($rootScope, $controller) {
            initMocksAndFakes();

            subject = $controller('MainCtrl', {
                $scope: $scope,
                atmMachineService: mockAtmMachineService
            });
        }));

        describe('main controller', function () {

            it('should ....', inject(function ($controller) {
                //spec body
                expect(mainCtrl).toBeDefined();
            }));

        });

        function initMocksAndFakes() {
            mockAtmMachineService = jasmine.createSpyObj('atmMachineService', [
                'atmCardInserted',
                'submitPin',
                'cancel',
                'startWithdrawal',
                'showAccountBalance',
                'printAccountBalance'
            ]);
        }
    });
});