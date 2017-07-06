angular
    .module('openDeskApp.declaration')
    .controller('DocumentController', DocumentController);

function DocumentController($scope, $state, $mdDialog, declarationService, documentToolbarService, 
                            siteService, documentService) {
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
        $state.go('declaration.show.documents.view-file', {nodeid:  file.shortRef});
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

}