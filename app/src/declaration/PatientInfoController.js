angular
    .module('openDeskApp.declaration')
    .controller('PatientInfoController', PatientInfoController);

function PatientInfoController($scope, $state, $stateParams, declarationService) {

    $scope.declarationService = declarationService;
    $scope.editPatientData = false;
    $scope.case = {};

    $scope.$watch('declarationService.getCurrentCase()', function (newVal) {
        $scope.case = newVal;
    });

    $scope.$watch('declarationService.isEditing()', function (newVal) {
        $scope.editPatientData = newVal;
    });

    $scope.$watch('case', function (newVal) {
        declarationService.updateNewCase(newVal);
    }, true);

}