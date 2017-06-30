angular
    .module('openDeskApp.declaration')
    .controller('DeclarationSearchController', DeclarationSearchController);

function DeclarationSearchController($scope, $stateParams, declarationService) {

    $scope.editMode = false;

    $scope.toggleEdit = function() {
        $scope.editMode = !$scope.editMode;
        declarationService.toggleEdit();
    }

    $scope.saveEdit = function() {
        var newCase = declarationService.getNewCaseInfo();
        declarationService.updateCase($stateParams.caseid,newCase).then(function(response) {
            console.log(response);
        });
    }
}