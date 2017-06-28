angular
    .module('openDeskApp.declaration')
    .controller('PatientInfoToolbarController', PatientInfoToolbarController);

function PatientInfoToolbarController($scope, patientInfoToolbarService) {

    $scope.editMode = false;

    $scope.toggleEdit = function() {
        $scope.editMode = !$scope.editMode;
        patientInfoToolbarService.toggleEdit();
    }
}