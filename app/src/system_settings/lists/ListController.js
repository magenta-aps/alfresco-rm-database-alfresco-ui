'use strict';

angular
  .module('openDeskApp.declaration')
  .controller('ListController', ListController);

function ListController($scope, $stateParams, $mdDialog, Toast, propertyService, HeaderService) {

  $scope.selectedContent = [];
  $scope.newEntry = '';
  $scope.newEntry_email = '';
  $scope.renameOriginal = {};


  $scope.listTitle = $stateParams.listTitle;
  $scope.listContent = propertyService.getPropertyContent($stateParams.listData);

  HeaderService.addAction('COMMON.ADD', 'add', addNewDialog);

  $scope.query = {
    order: 'title'
  }

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

    // choose special dialog if myndigheder

    if ($scope.listTitle == "Myndighed") {

            $mdDialog.show({
              templateUrl: 'app/src/system_settings/lists/view/list-create-myndighed.html',
              scope: $scope, // use parent scope in template
              preserveScope: true, // do not forget this if use parent scope
              clickOutsideToClose: true
            });
    }
    else {

          $mdDialog.show({
              templateUrl: 'app/src/system_settings/lists/view/list-create.html',
              scope: $scope, // use parent scope in template
              preserveScope: true, // do not forget this if use parent scope
              clickOutsideToClose: true
        });
    }


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

    if ($scope.listTitle == "Myndighed") {
        propertyService.addPropertyValue($scope.newEntry + " (" + $scope.newEntry_email +")");
    }
    else {
        propertyService.addPropertyValue($scope.newEntry);
    }

    Toast.show($scope.newEntry + ' blev tilføjet');
    $scope.newEntry = '';
    $scope.newEntry_email = '';
    $scope.cancel();
  }

  $scope.delete = function () {
    propertyService.deletePropertyValues($scope.selectedContent);
    angular.forEach($scope.selectedContent, function (deleted) {
      Toast.show(deleted.title + ' blev slettet');
    })
    $scope.selectedContent = [];
    $scope.cancel();
  }

  $scope.rename = function () {
    propertyService.renamePropertyValue($scope.renameOriginal, { title: $scope.newEntry });
    Toast.show($scope.renameOriginal.title + ' blev omdøbt til ' + $scope.newEntry);
    $scope.newEntry = '';
    $scope.renameOriginal = {};
    $scope.cancel();
  }

  $scope.cancel = function () {
    $mdDialog.cancel();
  }
}