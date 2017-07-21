angular
    .module('openDeskApp.declaration')
    .controller('DocumentController', DocumentController);

function DocumentController($scope, $state, $stateParams, $mdDialog, declarationService, documentToolbarService,
    siteService, documentService, documentPreviewService, alfrescoDownloadService) {
    var vm = this;

    $scope.selectedFiles = documentService.getSelectedFiles();
    $scope.isEditing = false;

    $scope.documentService = documentService;
    $scope.documentToolbarService = documentToolbarService;
    $scope.declarationService = declarationService;

    $scope.contents = [];
    $scope.contentLength = 0;

    $scope.case = {};

    $scope.tableView = false;

    $scope.query = {
        order: 'name'
    }

    //update service with currently selected files
    $scope.$watch('selectedFiles', function (newVal, oldVal) {
        documentService.setSelectedFiles(newVal);
    }, true);

    //load files using the current case
    $scope.$watch('declarationService.getCurrentCase()', function (newVal) {
        $scope.case = newVal;
        if (newVal['node-uuid']) {
            loadFiles($scope.case['node-uuid']);
        }
    });

    //refresh contents
    $scope.$watch('documentService.getCaseFiles()', function (newVal) {
        $scope.contents = newVal;
        documentService.resetSelectedFiles();
    });

    $scope.$watch('contents', function (newVal) {
        console.log('content updated');
        newVal.forEach(function (contentTypeList) {
                $scope.contentLength += contentTypeList.length;
            });
        // $scope.contents = newVal;
        // documentService.resetSelectedFiles();
    },true);

    //change view
    $scope.$watch('documentToolbarService.getDocumentView()', function (newVal) {
        $scope.tableView = newVal;
    });

    $scope.selectedFile = function (file) {
        if ($scope.selectedFiles.indexOf(file) > -1) {
            $scope.selectedFiles.splice($scope.selectedFiles.indexOf(file), 1);
        } else {
            $scope.selectedFiles.push(file);
        }

        if ($scope.selectedFiles.length > 0) {
            $scope.isEditing = true;
            $state.go('declaration.show.documents.edit');
        } else {
            $scope.isEditing = false;
            $state.go('declaration.show.documents');
        }
    }

    $scope.viewFile = function (file) {
        $state.go('declaration.show.documents.view-file', {
            nodeid: file.shortRef,
        });
    }

    function loadFiles(node) {
        console.log('load files');
        declarationService.getContents(node).then(function (response) {
            documentService.setCaseFiles(response);
            $scope.contents = response;
            $scope.contents.forEach(function (contentTypeList) {
                $scope.contentLength += contentTypeList.length;
            });
            $scope.selectedFiles = []; //reset selected files
            console.log(response);
        });
    };


    $scope.getPDF = function (nodeRef) {
        console.log('get pdf ' + nodeRef);
        documentPreviewService.previewDocumentPlugin(nodeRef).then(function (plugin) {
            $scope.config = plugin;
            $scope.viewerTemplateUrl = documentPreviewService.templatesUrl + plugin.templateUrl;

            if (plugin.initScope) {
                plugin.initScope($scope);
            }

        });
    }

    function init() {
        if($stateParams.nodeid) {
            console.log('hello world ' + $stateParams.nodeid);
            $scope.getPDF('workspace://SpacesStore/' + $stateParams.nodeid);                
        }
    }

    init();

}