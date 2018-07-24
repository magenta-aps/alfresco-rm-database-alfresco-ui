'use strict';

angular
    .module('openDeskApp.declaration')
    .controller('DeclarationCreateController', DeclarationCreateController);

function DeclarationCreateController($scope, $state, $mdToast, $translate, entryService, propertyService, filterService, cprService, HeaderService) {

    var vm = this;

    $scope.editPatientData = true;
    $scope.case = {};
    $scope.case.biDiagnoses = [];
    $scope.case.creationDate = new Date();
    $scope.propertyValues = propertyService.getAllPropertyValues();
    $scope.propertyFilter = propertyFilter;
    $scope.addNewBidiagnosis = addNewBidiagnosis;
    vm.lookupCPR = lookupCPR;

    HeaderService.resetActions();
    HeaderService.addAction('Gem', 'save', submit);

    activated();

    $scope.$watch('case', function (newVal) {
        entryService.updateNewCase(newVal);
    }, true);

    function activated() {
        $scope.case.bua = $state.current.name === 'declaration.create-bua' ? true : false;
        var title = $scope.case.bua ? 'DECLARATION.NEW_BUA_DECLARATION' : 'DECLARATION.NEW_DECLARATION';
        HeaderService.setTitle($translate.instant(title));
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
        cprService.getCPRData($scope.case.cprNumber)
            .then(function (response) {
                var name = response.NAVN.split(',');

                $scope.case.firstName = name[1];
                $scope.case.lastName = name[0];
                $scope.case.address = response.GADE;
                $scope.case.postbox = response.POSTNR;
                $scope.case.city = response.BY;

            });
    }

    function submit() {
        var newCase = {
            bua: $state.current.name === 'declaration.create-bua' ? true : false,
            properties: $scope.case
        }

        newCase.properties.fullName = newCase.properties.firstName + ' ' + newCase.properties.lastName;

        entryService.createEntry(newCase)
            .then(function (response) {
                entryService.setCurrentCaseAfterCreation(response);
                $state.go('declaration.show.patientdata', { caseid: response.caseNumber });

                $mdToast.show(
                    $mdToast.simple()
                        .textContent('Sagen er oprettet')
                        .position('top right')
                        .hideDelay(3000)
                );
            });
    }
}