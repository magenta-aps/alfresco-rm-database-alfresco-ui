'use strict';

angular
    .module('openDeskApp.declaration')
    .controller('DeclarationCreateController', DeclarationCreateController);

function DeclarationCreateController($scope, declarationService, filterService) {

    $scope.editPatientData = true;
    $scope.case = {};
    $scope.case.creationDate = new Date();
    $scope.dropdownOptions = declarationService.getAllDropdownOptions();

    $scope.bidiagnoses = [{id: 'bidiagnosis1'}];

    console.log($scope.dropdownOptions);

    $scope.$watch('case', function (newVal, oldVal) {
        declarationService.updateNewCase(newVal);
    }, true);


    $scope.dropdownFilter = function(array, query) {
        return filterService.dropdownFilter(array, query);
    }

    $scope.addNewBidiagnosis = function () {
        var newItemNo = $scope.bidiagnoses.length + 1;
        $scope.bidiagnoses.push({
            'id': 'bidiagnosis' + newItemNo
        });
    };
}