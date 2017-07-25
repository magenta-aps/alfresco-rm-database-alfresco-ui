angular
    .module('openDeskApp.declaration')
    .controller('ListActionController', ListActionController);

function ListActionController($scope, $state, $stateParams, $mdDialog, listService, declarationService, selectedForRename) {

    $scope.selectedForRename = angular.copy(selectedForRename);
    var originalName = angular.copy(selectedForRename);

    $scope.selectedContent = listService.getSelectedContent();

    $scope.addNew = {};
    $scope.addNew.title = '';

    $scope.addNew = function() {
        listService.addPropertyValue($scope.addNew.title);
        $scope.cancel();
    }

    $scope.rename = function() {
        listService.renamePropertyValue(originalName,$scope.selectedForRename);
        $scope.cancel();
    }

    $scope.delete = function() {
        listService.deletePropertyValues($scope.selectedContent);        
        $scope.cancel();
    }

    $scope.cancel = function() {
        $mdDialog.cancel();
    }
}