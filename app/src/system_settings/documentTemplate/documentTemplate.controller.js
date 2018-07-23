'use strict';

angular
  .module('openDeskApp.systemsettings')
  .controller('DocumentTemplateController', DocumentTemplateController);

function DocumentTemplateController($scope, $stateParams, ContentService) {
  var vm = this;

  $scope.folderUuid = [];

  activate()

  function activate() {
    $scope.isLoading = true;
    ContentService.getFolderNodeRefFromPath($stateParams.path)
      .then(function (response) {
        $scope.folderUuid = response;
      })
  }

}