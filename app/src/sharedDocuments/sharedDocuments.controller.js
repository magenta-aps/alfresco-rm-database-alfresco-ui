'use strict';

angular
  .module('oda.sharedDocuments')
  .controller('SharedDocumentsController', SharedDocumentsController);

function SharedDocumentsController($scope, $stateParams, $translate, ContentService, HeaderService) {
  var vm = this;

  $scope.folderUuid = [];

  HeaderService.setTitle($translate.instant('DOCUMENT.DOCUMENTS'))
  activate();

  function activate() {
    $scope.isLoading = true;
    ContentService.getFolderNodeRefFromPath($stateParams.path)
      .then(function (response) {
        $scope.folderUuid = response;
      })
  }
}