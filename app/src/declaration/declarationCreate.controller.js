'use strict';

angular
    .module('openDeskApp.declaration')
    .controller('DeclarationCreateController', DeclarationCreateController);

function DeclarationCreateController($scope, $state, $timeout, $mdToast, entryService, propertyService, filterService, loadingService, cprService) {

    var vm = this;

    $scope.editPatientData = true;
    $scope.case = {};
    $scope.case.biDiagnoses = [];
    $scope.case.creationDate = new Date();
    $scope.propertyValues = propertyService.getAllPropertyValues();
    $scope.propertyFilter = propertyFilter;
    $scope.addNewBidiagnosis = addNewBidiagnosis;
    vm.lookupCPR = lookupCPR;

    entryService.setLoading(true);

    activated();

    $timeout(function () {
        loadingService.setLoading(false);
    });
    
    $scope.$watch('case', function (newVal, oldVal) {
        entryService.updateNewCase(newVal);
    }, true);
    
    function activated () {
        console.log($state.current.name)
        $scope.case.bua = $state.current.name === 'declaration.create-bua' ? true : false;
    }

    function propertyFilter(array, query) {
        return filterService.propertyFilter(array, query);
    }
    
    function addNewBidiagnosis() {
        var newItemNo = $scope.case.biDiagnoses.length + 1;
        if ($scope.case.biDiagnoses.indexOf(null) < 0) {
            $scope.case.biDiagnoses.push(null);
        }
    }
    
    function lookupCPR() {
        cprService.getCPRData($scope.case.cprNumber).then(function(response) {
            var name = response.NAVN.split(',');

            $scope.case.firstName = name[1];
            $scope.case.lastName = name[0];
            $scope.case.address = response.GADE;
            $scope.case.postbox = response.POSTNR;
            $scope.case.city = response.BY;
            
        });
    }
}