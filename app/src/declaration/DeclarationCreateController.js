'use strict';

angular
    .module('openDeskApp.declaration')
    .controller('DeclarationCreateController', DeclarationCreateController);

function DeclarationCreateController($scope, declarationService) {

    $scope.editPatientData = true;
    $scope.case = {};

    $scope.$watch('case', function (newVal, oldVal) {
        declarationService.updateNewCase(newVal);
    }, true);
}