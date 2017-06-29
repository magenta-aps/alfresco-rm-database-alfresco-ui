angular
    .module('openDeskApp.declaration')
    .controller('SearchToolbarController', SearchToolbarController);

function SearchToolbarController($scope, $state) {

    $scope.createNewDeclaration = function() {
        $state.go('declaration.create');
    }
}