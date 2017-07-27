'use strict';

angular
    .module('openDeskApp.declaration')
    .controller('DeclarationCreateController', DeclarationCreateController);

function DeclarationCreateController($scope, declarationService, filterService) {

    $scope.editPatientData = true;
    $scope.case = {};
    $scope.case.biDiagnoses = [];
    $scope.case.creationDate = new Date();
    $scope.dropdownOptions = declarationService.getAllDropdownOptions();

    $scope.$watch('case', function (newVal, oldVal) {
        declarationService.updateNewCase(newVal);
    }, true);


    $scope.dropdownFilter = function(array, query) {
        return filterService.dropdownFilter(array, query);
    }

    $scope.addNewBidiagnosis = function () {
        var newItemNo = $scope.case.biDiagnoses.length + 1;
        if ($scope.case.biDiagnoses.indexOf(null) < 0) {
            $scope.case.biDiagnoses.push(null);
        }
    };
}