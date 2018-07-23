'use strict';

angular
  .module('oda.sharedDocuments')
  .controller('SharedDocumentsController', SharedDocumentsController);

function SharedDocumentsController($scope, $stateParams, ContentService) {
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