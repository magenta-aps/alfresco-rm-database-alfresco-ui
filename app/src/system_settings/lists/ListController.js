'use strict';

angular
    .module('openDeskApp.declaration')
    .controller('ListController', ListController);

function ListController($scope, $stateParams, $mdDialog, propertyService, loadingService, HeaderService) {

    $scope.selectedContent = [];
    $scope.newEntry = '';
    $scope.renameOriginal = {};

    $scope.listTitle = $stateParams.listTitle;
    $scope.listContent = propertyService.getPropertyContent($stateParams.listData);

    HeaderService.resetActions();
    HeaderService.addAction('COMMON.ADD', 'add', addNewDialog);

    $scope.query = {
        order: 'title'
    }

    loadingService.setLoading(true);

    angular.element(document).ready(function () {
        loadingService.setLoading(false);
    });

    $scope.$watch('listContent', function (newVal) {
        var selectedContent = [];
        newVal.forEach(function (element) {
            if (element.selected) {
                selectedContent.push(element);
            }
        }, this);
        $scope.selectedContent = selectedContent;

        if (selectedContent.length > 0) {
            HeaderService.resetActions();
            HeaderService.addAction('COMMON.DELETE', 'delete', deleteDialog);
            HeaderService.addAction('COMMON.ADD', 'add', addNewDialog);
        } else {
            HeaderService.resetActions();
            HeaderService.addAction('COMMON.ADD', 'add', addNewDialog);
        }
    }, true);

    function addNewDialog() {
        $mdDialog.show({
            templateUrl: 'app/src/system_settings/lists/view/list-create.html',
            scope: $scope, // use parent scope in template
            preserveScope: true, // do not forget this if use parent scope
            clickOutsideToClose: true
        });
    }

    function deleteDialog() {
        $mdDialog.show({
            templateUrl: 'app/src/system_settings/lists/view/list-delete.html',
            scope: $scope, // use parent scope in template
            preserveScope: true, // do not forget this if use parent scope
            clickOutsideToClose: true
        });
    }

    $scope.renameDialog = function (value) {
        $scope.renameOriginal = angular.copy(value);
        $scope.newEntry = value.title;

        $mdDialog.show({
            templateUrl: 'app/src/system_settings/lists/view/list-rename.html',
            scope: $scope, // use parent scope in template
            preserveScope: true, // do not forget this if use parent scope
            clickOutsideToClose: true
        });
    };

    $scope.addNew = function () {
        propertyService.addPropertyValue($scope.newEntry);
        $scope.newEntry = '';
        $scope.cancel();
    }

    $scope.delete = function () {
        propertyService.deletePropertyValues($scope.selectedContent);
        $scope.selectedContent = [];
        $scope.cancel();
    }

    $scope.rename = function () {
        propertyService.renamePropertyValue($scope.renameOriginal, { title: $scope.newEntry });
        $scope.newEntry = '';
        $scope.renameOriginal = {};
        $scope.cancel();
    }

    $scope.cancel = function () {
        $mdDialog.cancel();
    }
}