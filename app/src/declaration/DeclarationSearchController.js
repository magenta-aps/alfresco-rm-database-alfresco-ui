angular
    .module('openDeskApp.declaration')
    .controller('DeclarationSearchController', DeclarationSearchController);

function DeclarationSearchController($scope, $stateParams) {

    $scope.editMode = false;

    $scope.toggleEdit = function() {
        $scope.editMode = !$scope.editMode;
        patientInfoToolbarService.toggleEdit();
    }

    $scope.saveEdit = function() {
        var newCase = declarationService.getNewCaseInfo();
        declarationService.updateCase($stateParams.caseid,newCase).then(function(response) {
            console.log(response);
        });
    }
}