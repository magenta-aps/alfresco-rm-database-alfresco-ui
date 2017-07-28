angular
    .module('openDeskApp.declaration')
    .controller('ListActionController', ListActionController);

function ListActionController($scope, $state, $stateParams, $mdDialog, propertyService, selectedForRename) {

    $scope.selectedForRename = angular.copy(selectedForRename);
    var originalName = angular.copy(selectedForRename);

    $scope.selectedContent = propertyService.getSelectedContent();

    $scope.addNew = {};
    $scope.addNew.title = '';

    $scope.addNew = function() {
        propertyService.addPropertyValue($scope.addNew.title);
        $scope.cancel();
    }

    $scope.rename = function() {
        propertyService.renamePropertyValue(originalName,$scope.selectedForRename);
        $scope.cancel();
    }

    $scope.delete = function() {
        propertyService.deletePropertyValues($scope.selectedContent);        
        $scope.cancel();
    }

    $scope.cancel = function() {
        $mdDialog.cancel();
    }
}