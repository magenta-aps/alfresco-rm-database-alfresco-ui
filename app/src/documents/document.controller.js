'use strict'


angular.module('openDeskApp.documents')
  .controller('DocumentController', DocumentController);


function DocumentController($scope, documentService, $stateParams, $state,
  documentPreviewService, alfrescoDownloadService, $window, HeaderService,$location, $mdDialog, authService) {

  var vm = this;

  vm.doc = [];
  vm.plugin = [];
  vm.canEdit = false;
  vm.showEditVersionDialog = showEditVersionDialog;
  vm.acceptEditVersionDialog = acceptEditVersionDialog;
  vm.cancelDialog = cancelDialog;
  vm.updateCollapse = updateCollapse;
  vm.canRevertDocument = canRevertDocument;


  if ($location.search().latest == undefined) {
    vm.latest = true;
  }
  else {
    console.log("setting...")
    console.log($location.search().latest);
    vm.latest = $location.search().latest == "true";
  }





  function updateCollapse() {
    vm.collapse = !vm.collapse;
    console.log("clicked");
  }


   function cancelDialog() {
      $mdDialog.cancel()
    }


    vm.docHasParent = $location.search().versionId !== undefined
    vm.parentNodeId = $stateParams.doc
    vm.nodeId = vm.docHasParent ? $location.search().versionId : $stateParams.doc


    if (vm.docHasParent)
        vm.doc.store = 'versionStore://version2Store/'
    else
        vm.doc.store = 'workspace://SpacesStore/'

  vm.updatePreview = loadPreview;
  vm.goBack = goBack;
  vm.goToLOEditPage = goToLOEditPage;
  vm.downloadDocument = downloadDocument;


  var selectedDocumentNode = $stateParams.doc;
  vm.selectedVersion = $location.search().version;

  vm.collapse = vm.selectedVersion != null ? false : true;


  angular.element($window).bind('resize', function () {
    setPDFViewerHeight();
    // manuall $digest required as resize event
    // is outside of angular
    $scope.$digest();
  });

  activate();

  function loadState() {

    var state = documentService.getState("workspace://SpacesStore/" + selectedDocumentNode).then(function (response) {
            vm.state = response.state;
            vm.editByText = "Dokumentet redigeres af "  + response.firstName + " " + response.lastName;
          });
  }


  function activate() {

console.log("hvad er vm.docHasParent");
console.log(vm.docHasParent);

console.log("hvad er vm.latest");
console.log(vm.latest);


console.log("result");
console.log( vm.docHasParent || vm.latest );

    if ( !vm.docHasParent) {

        if (vm.latest) {
            vm.showRevertButton = false;
        }
        else {
         vm.showRevertButton = true;
        }


    }
    else if (vm.latest) {
    console.log("setting true");
        vm.showRevertButton = false;
    }
    else {
        vm.showRevertButton = true;
    }


    console.log("hvad er show");
    console.log(vm.showRevertButton)

    HeaderService.resetActions();
    setPDFViewerHeight();
    loadPreview();
    getDocument(vm.docHasParent);
    loadState();

    //documentService.getVersions(selectedDocumentNode);
    console.log()

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

  function showEditVersionDialog () {
      $mdDialog.show({
        templateUrl: 'app/src/documents/view/confirmEditVersionDialog.html',
        scope: $scope,
        preserveScope: true,
        clickOutsideToClose: true
      })
    }

  function getDocument(revisioncall) {


        documentService.getDocument(selectedDocumentNode).then(function (response) {

            console.log("the response");
            console.log(response);

            vm.doc = response.item;
            vm.docMetadata = response.metadata;
            vm.loolEditable = documentService.isLoolEditable(vm.doc.mimetype);
            console.log(vm.doc.permissions.userAccess);
            vm.canEdit = vm.doc.permissions.userAccess.edit;
            console.log(vm.canEdit);

            documentService.getVersions(selectedDocumentNode).then(function (response) {

            vm.history = response;

            if (revisioncall) {
                vm.history.latest_version = ""
            }
            else {
                vm.history.latest_version = response[0].version;
            }
    });
  });
}

  function loadPreview() {


    vm.store = vm.doc.store;


    if (vm.docHasParent) {
          documentService.getThumbnail(vm.parentNodeId, vm.nodeId).then(function (response) {

                documentPreviewService.previewDocumentPlugin(response.data.nodeRef)
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
                  })
  }
   else
        documentPreviewService.previewDocumentPlugin(vm.doc.store + vm.nodeId)
          .then(function (plugin) {
            vm.plugin = plugin

            $scope.config = plugin;
            $scope.viewerTemplateUrl = documentPreviewService.templatesUrl + plugin.templateUrl;
            $scope.download = function () {
              alfrescoDownloadService.downloadFile($scope.config.nodeRef, $scope.config.fileName);
            };

            if (plugin.initScope) {
              plugin.initScope($scope);
            }

          })
  }

  //Goes to the libreOffice online edit page
  function goToLOEditPage() {

            documentService.getState("workspace://SpacesStore/" + selectedDocumentNode).then(function (response) {


            console.log(response);

            if (!response.state) {

                    console.log(response);

                  documentService.markDocumentAsEditing("workspace://SpacesStore/" + selectedDocumentNode).then(function (response) {

                    console.log("response to")
                    console.log(response);

                                                $state.go('lool', {
                                                                  'nodeRef': vm.doc.nodeRef
                                                                });

                                            });

            }

            else {
                $state.reload()

            }


//



            });


  }

  function downloadDocument() {
    var versionRef = vm.store + $stateParams.doc;
    alfrescoDownloadService.downloadFile(versionRef, vm.doc.location.file);
  }

  function canRevertDocument() {
      return authService.isAuthorized('SiteEntryLockManager');
  }


  function acceptEditVersionDialog() {

      var selectedVersion = $location.search().version
            documentService.revertToVersion("workspace://SpacesStore/" + selectedDocumentNode, selectedVersion).then(
        function (response) {

            console.log(response);
          cancelDialog();
          $window.location.href = '#!/dokument/' + selectedDocumentNode;
        })
    }




}










