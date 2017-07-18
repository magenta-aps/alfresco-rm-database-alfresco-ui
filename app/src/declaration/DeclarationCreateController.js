'use strict';

angular
    .module('openDeskApp.declaration')
    .controller('DeclarationCreateController', DeclarationCreateController);

function DeclarationCreateController($scope, declarationService) {

    $scope.editPatientData = true;
    $scope.case = {};
    $scope.case.creationDate = new Date();
    $scope.dropdownOptions = declarationService.getAllDropdownOptions();

    $scope.$watch('case', function (newVal, oldVal) {
        declarationService.updateNewCase(newVal);
        console.log(newVal);
    }, true);
}