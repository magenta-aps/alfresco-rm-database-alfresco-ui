'use strict';

angular
  .module('oda.content')
  .controller('ContentActionController', ContentActionController);

function ContentActionController($scope, $mdDialog, ContentService) {

  $scope.content;

  $scope.action = {
    move: false,
    delete: false,
    rename: false,
    edit: false,
    download: false
  }

  activate();

  function activate() {
    switch ($scope.content.contentType) {
      case 'cmis:folder':
        $scope.action.rename = true;
        $scope.action.delete = true;
        break;
      case 'cmis:document':
        $scope.action.download = true
        $scope.action.rename = true;
        $scope.action.delete = true;
        break;
    }
  }

  $scope.download = function (nodeRef, name) {
    ContentService.download(nodeRef, name);
  }

  $scope.deleteDialog = function () {
    $mdDialog.show({
      templateUrl: 'app/src/content/action/delete.view.html',
      scope: $scope, // use parent scope in template
      preserveScope: true, // do not forget this if use parent scope
      clickOutsideToClose: true
    });
  }

  $scope.cancelDialog = function () {
    $mdDialog.cancel();
  }

  $scope.delete = function () {
    ContentService.delete($scope.content.nodeRef)
      .then(function () {
        $scope.cancelDialog();
      });
  }
}
