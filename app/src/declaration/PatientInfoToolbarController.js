angular
    .module('openDeskApp.declaration')
    .controller('PatientInfoToolbarController', PatientInfoToolbarController);

function PatientInfoToolbarController($scope, $mdDialog, $state, $stateParams, declarationService) {

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

    $scope.lockCase = function() {
        $mdDialog.show({
            templateUrl: 'app/src/declaration/view/lock-dialog.html',
            parent: angular.element(document.body),
            targetEvent: event,
            scope: $scope, // use parent scope in template
            preserveScope: true, // do not forget this if use parent scope
            clickOutsideToClose: true
        });
    }

    $scope.back = function() {
        $state.go('declaration');
    }
}