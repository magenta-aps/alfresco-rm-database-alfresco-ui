angular
    .module('openDeskApp.declaration')
    .controller('PatientInfoToolbarController', PatientInfoToolbarController);

function PatientInfoToolbarController($scope, $state, $stateParams, declarationService) {

    $scope.declarationService = declarationService;

    $scope.editMode = false;

    $scope.caseTitle = '';

    $scope.$watch('declarationService.getCaseTitle()', function (newVal) {
        $scope.caseTitle = newVal;
    });

    $scope.toggleEdit = function() {
        $scope.editMode = !$scope.editMode;
        declarationService.toggleEdit();

        if($scope.editMode) {
            $state.go('declaration.show.patientdata.edit');
        } else {
            $state.go('declaration.show.patientdata');
        }
    }

    $scope.saveEdit = function() {
        var newCase = declarationService.getNewCaseInfo();
        declarationService.updateCase($stateParams.caseid,newCase).then(function(response) {
            console.log(response);
        });
    }

    $scope.back = function() {
        $state.go('declaration');
    }
}