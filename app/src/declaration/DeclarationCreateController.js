'use strict';

angular
    .module('openDeskApp.declaration')
    .controller('DeclarationCreateController', DeclarationCreateController);

function DeclarationCreateController($scope, declarationService, filterService) {

    $scope.editPatientData = true;
    $scope.case = {};
    $scope.case.creationDate = new Date();
    $scope.dropdownOptions = declarationService.getAllDropdownOptions();

    $scope.$watch('case', function (newVal, oldVal) {
        declarationService.updateNewCase(newVal);
    }, true);


    $scope.dropdownFilter = function(array, query, filters) {
        return filterService.caseSearch(array, query, filters);
    }
}