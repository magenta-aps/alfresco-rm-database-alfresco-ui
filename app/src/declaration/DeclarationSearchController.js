angular
    .module('openDeskApp.declaration')
    .controller('DeclarationSearchController', DeclarationSearchController);

function DeclarationSearchController($scope, $state, $stateParams) {

    $scope.caseid;

    $scope.search = function() {
        console.log('soeg efter ' + $scope.caseid);
        $state.go('declaration.show', {caseid: $scope.caseid});
    }
}