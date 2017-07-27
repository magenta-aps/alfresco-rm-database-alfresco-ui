angular
    .module('openDeskApp.declaration')
    .controller('DocumentController', DocumentController);

function DocumentController($scope, $state, $stateParams, $mdDialog, declarationService, documentToolbarService,
    siteService, documentService, documentPreviewService, preferenceService, authService, sessionService, alfrescoDownloadService) {
    var vm = this;

    $scope.selectedFiles = [];
    $scope.isEditing = false;

    $scope.documentService = documentService;
    $scope.documentToolbarService = documentToolbarService;
    $scope.declarationService = declarationService;

    $scope.contents = [];
    $scope.contentLength = 0;

    $scope.case = {};

    var currentUser = authService.getUserInfo().user;
    $scope.tableView = false;

    preferenceService.getPreferences(currentUser.userName,'dk.magenta.sites.retspsyk.tableView').then(function(response) {
        $scope.tableView = response['dk.magenta.sites.retspsyk.tableView'] == 'true' ? true : false;
    });

    $scope.query = {
        order: 'name'
    }

    //update service with currently selected files
    $scope.$watch('selectedFiles', function (newVal) {
        documentService.setSelectedFiles(newVal);
    }, true);

    $scope.$watch('documentService.getSelectedFiles()', function (newVal) {
        $scope.selectedFiles = newVal;
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
        newVal.forEach(function (contentTypeList) {
                $scope.contentLength += contentTypeList.length;
            });
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
            // response.thumbnail = sessionService.makeURL(response.thumbnail);
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

    $scope.thumbnailUrl = function(url) {
        return sessionService.makeURL(url);
    }

    function init() {
        if($stateParams.nodeid) {
            $scope.getPDF('workspace://SpacesStore/' + $stateParams.nodeid);                
        }
    }

    init();

}