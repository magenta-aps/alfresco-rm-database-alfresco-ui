angular
    .module('openDeskApp.declaration')
    .controller('DeclarationCreateToolbarController', DeclarationCreateToolbarController);

function DeclarationCreateToolbarController($scope, $state, declarationService) {

    $scope.submit = function() {
        var newCase = declarationService.getNewCaseInfo();
        newCase.fullName = newCase.firstName + ' ' + newCase.lastName;
        
        declarationService.createCase(newCase).then(function (response) {
            $state.go('declaration.show.patientdata', {caseid: response.caseNumber});
        })
    }

    $scope.createNewDeclaration = function() {
        $state.go('declaration.create');
    }
}