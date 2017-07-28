angular
    .module('openDeskApp.declaration')
    .controller('DeclarationCreateToolbarController', DeclarationCreateToolbarController);

function DeclarationCreateToolbarController($scope, $state, $mdToast, entryService) {

    $scope.submit = function() {
        var newCase = entryService.getNewCaseInfo();
        newCase.fullName = newCase.firstName + ' ' + newCase.lastName;
        
        entryService.createEntry(newCase).then(function (response) {
            entryService.setCurrentCaseAfterCreation(response);
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