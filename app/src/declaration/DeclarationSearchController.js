angular
    .module('openDeskApp.declaration')
    .controller('DeclarationSearchController', DeclarationSearchController);

function DeclarationSearchController($scope, $state, $stateParams) {

    $scope.caseid;
    $scope.showFilters = false;

    $scope.search = function() {
        console.log('soeg efter ' + $scope.caseid);
        $state.go('declaration.show', {caseid: $scope.caseid});
    }

    $scope.toggleFilters = function() {
        console.log('hello');
        $scope.showFilters = !$scope.showFilters;
    }
}