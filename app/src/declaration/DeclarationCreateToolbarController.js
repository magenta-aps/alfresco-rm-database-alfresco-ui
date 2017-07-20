angular
    .module('openDeskApp.declaration')
    .controller('DeclarationCreateToolbarController', DeclarationCreateToolbarController);

function DeclarationCreateToolbarController($scope, $state, $mdToast, declarationService) {

    $scope.submit = function() {
        var newCase = declarationService.getNewCaseInfo();
        newCase.fullName = newCase.firstName + ' ' + newCase.lastName;
        
        declarationService.createCase(newCase).then(function (response) {
            declarationService.setCurrentCaseAfterCreation(response);
            $state.go('declaration.show.patientdata', {caseid: response.caseNumber});

            $mdToast.show(
                $mdToast.simple()
                .textContent('Erklæringen er oprettet')
                .position('top right')
                .hideDelay(3000)
            );
        })
    }

    $scope.createNewDeclaration = function() {
        $state.go('declaration.create');
    }
}