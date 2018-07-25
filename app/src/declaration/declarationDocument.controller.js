'use strict';

angular
  .module('openDeskApp.declaration')
  .controller('DeclarationDocumentController', DocumentController);

function DocumentController($scope, $mdDialog, $stateParams, DeclarationService, loadingService, Toast,
  documentService, documentPreviewService, authService, sessionService, ContentService, HeaderService) {
  var vm = this;

  var hasSelectedContent = false;

  $scope.folderUuid;
  $scope.selectedContent;

  $scope.$watch('selectedContent', function (newVal) {
    if (newVal == undefined) return;
    hasSelectedContent = newVal.length > 0;
    updateHeaderActions();
  }, true)

  // $scope.case = {};

  // var currentUser = authService.getUserInfo().user;
  // $scope.tableView = false;

  loadingService.setLoading(true);
  activate();

  angular.element(document).ready(function () {
    loadingService.setLoading(false);
  });

  function activate() {
    DeclarationService.get($stateParams.caseid)
      .then(function (response) {
        var bua = response.bua ? ' (BUA)' : '';
        HeaderService.setTitle(response.firstName + ' ' + response.lastName + ' (' + response.caseNumber + ')' + bua);
        HeaderService.setClosed(response.closed);
        updateHeaderActions();
        const nodeRef = response['store-protocol'] + '://' + response['store-identifier'] + '/' + response['node-uuid']
        ContentService.setCurrentFolderNodeRef(nodeRef);
        $scope.folderUuid = response['node-uuid'];
      })
  }

  function updateHeaderActions() {
    HeaderService.resetActions();
    if (hasSelectedContent) {
      HeaderService.addAction('CONTENT.SEND_TO_AUTHORITY', 'mail', authorityMailDialog)
      HeaderService.addAction('COMMON.DOWNLOAD', 'file_download', downloadContent)
      HeaderService.addAction('COMMON.DELETE', 'delete', deleteContent)
    }

    HeaderService.addAction('COMMON.NEW_FOLDER', 'create_new_folder', newFolderDialog)
    HeaderService.addAction('CONTENT.NEW_DOCUMENT', 'file_upload', uploadDialog)
  }

  function newFolderDialog() {
    $mdDialog.show({
      templateUrl: 'app/src/content/folder/newFolder.view.html',
      controller: 'FolderController as vm',
      clickOutsideToClose: true
    });
  }

  function uploadDialog() {
    $mdDialog.show({
      templateUrl: 'app/src/content/upload/upload.view.html',
      controller: 'UploadController as vm',
      clickOutsideToClose: true
    });
  }

  function deleteContent() {
    $mdDialog.show({
      templateUrl: 'app/src/content/action/delete.view.html',
      controller: 'ContentActionController as vm',
      scope: $scope, // use parent scope in template
      preserveScope: true, // do not forget this if use parent scope
      clickOutsideToClose: true
    });
  }

  function downloadContent() {
    Toast.show('Henter filer...');
    var files = $scope.selectedContent;

    if (files.length == 1) {
      ContentService.download(files[0].nodeRef, files[0].name);
    } else {
      ContentService.downloadZippedFiles(files);
    }
  }

  function authorityMailDialog() {
    $mdDialog.show({
      templateUrl: 'app/src/authorityMail/authorityMail.view.html',
      controller: 'AuthorityMailController as vm',
      scope: $scope, // use parent scope in template
      preserveScope: true, // do not forget this if use parent scope
      clickOutsideToClose: true
    });
  }
}