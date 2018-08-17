'use strict';

angular
  .module('openDeskApp.systemsettings')
  .controller('DocumentTemplateController', DocumentTemplateController);

function DocumentTemplateController($scope, $stateParams, ContentService, HeaderService) {
  var vm = this;

  $scope.folderUuid = [];

  HeaderService.resetActions();
  activate()

  function activate() {
    $scope.isLoading = true;
    ContentService.getFolderNodeRefFromPath($stateParams.path)
      .then(function (response) {
        $scope.folderUuid = response;
      })
  }

}