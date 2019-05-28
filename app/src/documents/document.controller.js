'use strict';

angular.module('openDeskApp.documents')
  .controller('DocumentController', DocumentController);

function DocumentController($scope, documentService, $stateParams, $state,
  documentPreviewService, alfrescoDownloadService, $window, HeaderService) {

  var vm = this;

  vm.doc = [];
  vm.plugin = [];
  vm.canEdit = false;

  vm.updatePreview = loadPreview;
  vm.goBack = goBack;
  vm.goToLOEditPage = goToLOEditPage;
  vm.downloadDocument = downloadDocument;

  var selectedDocumentNode = $stateParams.doc;

  angular.element($window).bind('resize', function () {
    setPDFViewerHeight();
    // manuall $digest required as resize event
    // is outside of angular
    $scope.$digest();
  });

  activate();

  function loadState() {

    var state = documentService.getState("workspace://SpacesStore/" + selectedDocumentNode)

    .then(function (response) {
            console.log(response)

            vm.state = response;

//            vm.plugin = plugin;
//            $scope.config = plugin;
//            $scope.viewerTemplateUrl = documentPreviewService.templatesUrl + plugin.templateUrl;
//            $scope.download = function () {
//              alfrescoDownloadService.downloadFile($scope.config.nodeRef, $scope.config.fileName);
//            };
//
//            if (plugin.initScope) {
//              plugin.initScope($scope);
//            }
          });



  }


  function activate() {
    HeaderService.resetActions();
    setPDFViewerHeight();
    loadPreview();
    getDocument();
//    loadState();
  }

  function goBack() {
    window.history.go(-2);

  }

  function setPDFViewerHeight() {
    var height = $(window).height() - 150 - $("header").outerHeight();

    $scope.iframeStyle = {
      "height": height + 'px',
      "width": "100%"
    };
  }

  function getDocument() {
    documentService.getDocument(selectedDocumentNode)
      .then(function (response) {
        vm.doc = response.item;
        vm.docMetadata = response.metadata;
        vm.loolEditable = documentService.isLoolEditable(vm.doc.mimetype);
        vm.canEdit = vm.doc.permissions.userAccess.edit;
      });
  }

  function loadPreview() {
    vm.store = 'workspace://SpacesStore/';
    documentPreviewService.previewDocumentPlugin(vm.store + $stateParams.doc)
      .then(function (plugin) {

        vm.plugin = plugin;
        $scope.config = plugin;
        $scope.viewerTemplateUrl = documentPreviewService.templatesUrl + plugin.templateUrl;
        $scope.download = function () {
          alfrescoDownloadService.downloadFile($scope.config.nodeRef, $scope.config.fileName);
        };

        if (plugin.initScope) {
          plugin.initScope($scope);
        }
      });

  }

  //Goes to the libreOffice online edit page
  function goToLOEditPage() {


//    documentService.getState("workspace://SpacesStore/" + selectedDocumentNode).then(function (response){
//        if (response) {
//            alert("dokumentet er låst og redigeres af en anden bruger");
//            console.log("did the alert thing");
//        }
//        else {
//            documentService.markDocumentAsEditing("workspace://SpacesStore/" + selectedDocumentNode)

            $state.go('lool', {
                  'nodeRef': vm.doc.nodeRef
                });

        }




  function downloadDocument() {
    var versionRef = vm.store + $stateParams.doc;
    alfrescoDownloadService.downloadFile(versionRef, vm.doc.location.file);
  }
}