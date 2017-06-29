angular
    .module('openDeskApp.declaration')
    .controller('DeclarationCreateToolbarController', DeclarationCreateToolbarController);

function DeclarationCreateToolbarController($scope, $state, declarationService) {

    $scope.submit = function() {
        var newCase = declarationService.getNewCaseInfo();
        console.log(newCase);
        declarationService.createCase(newCase).then(function (response) {
            console.log(response);
            $state.go('declaration.show.patientdata', {caseid: response.caseNumber});
        })
    }
}