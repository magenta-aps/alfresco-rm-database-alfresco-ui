angular
    .module('openDeskApp.declaration')
    .controller('PatientInfoToolbarController', PatientInfoToolbarController);

function PatientInfoToolbarController($scope, $stateParams, patientInfoToolbarService, declarationService) {

    $scope.editMode = false;

    $scope.toggleEdit = function() {
        $scope.editMode = !$scope.editMode;
        patientInfoToolbarService.toggleEdit();
    }

    $scope.saveEdit = function() {
        var newCase = declarationService.getNewCaseInfo();
        console.log(newCase);
        declarationService.updateCase($stateParams.caseid,newCase).then(function(response) {
            console.log(response);
        });
    }
}