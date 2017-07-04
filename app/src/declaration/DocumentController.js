angular
    .module('openDeskApp.declaration')
    .controller('DocumentController', DocumentController);

function DocumentController($scope, $state, $mdDialog, declarationService, documentToolbarService, siteService, documentService) {
    var vm = this;

    $scope.selectedFiles = documentService.getSelectedFiles();
    $scope.isEditing = false;

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
        if (newVal['node-uuid'])
            loadFiles($scope.case['node-uuid']);
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

    $scope.openFile = function (file) {
        console.log('open the file');
    }

    function loadFiles(node) {
        declarationService.getContents(node).then(function (response) {
            $scope.contents = response;
            $scope.contents.forEach(function (contentTypeList) {
                $scope.contentLength += contentTypeList.length;

                // contentTypeList.forEach(function(file) {
                //     console.log(file);
                //     getThumbnail(file);
                // });
            });
            console.log(response)
        });
    };

    function getThumbnail(node) {
        documentService.createThumbnail(node.parentNodeRef, node.nodeRef).then(function (response) {
            console.log(response);
        });
    }

    vm.deleteFiles = function () {
        var files = documentService.getSelectedFiles();
        files.forEach(function (file) {
            console.log(file);
            siteService.deleteFile(file.nodeRef).then(function (response) {
                console.log(response);
                //loadFiles($scope.case['node-uuid']);
            });
        })
        $mdDialog.hide();
    }

}