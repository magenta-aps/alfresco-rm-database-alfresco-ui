angular
    .module('openDeskApp.declaration')
    .controller('ListActionController', ListActionController);

function ListActionController($scope, $state, $stateParams, declarationService) {

    $scope.addNew = function() {
        console.log('hello world');
    }
}