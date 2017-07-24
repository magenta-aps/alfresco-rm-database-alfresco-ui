angular
    .module('openDeskApp.declaration')
    .controller('ListController', ListController);

function ListController($scope, $state, $stateParams, declarationService) {

    $scope.listTitle = $stateParams.listTitle;
    $scope.listContent = declarationService.getDropdownOptions($stateParams.listData);
}