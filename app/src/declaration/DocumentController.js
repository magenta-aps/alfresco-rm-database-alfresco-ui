angular
    .module('openDeskApp.declaration')
    .controller('DocumentController', DocumentController);

function DocumentController($scope, $state, declarationService, documentToolbarService, siteService, documentService) {
    var vm = this;

    var selectedFiles = [];
    $scope.isEditing = false;

    $scope.documentToolbarService = documentToolbarService;
    $scope.declarationService = declarationService;

    $scope.contents = [];
    $scope.contentLength = 0;

    $scope.case = {};

    $scope.tableView = false;

    $scope.$watch('declarationService.getCurrentCase()', function (newVal) {
        $scope.case = newVal;
        if (newVal['node-uuid'])
            loadFiles($scope.case['node-uuid']);
    });

    $scope.$watch('documentToolbarService.getDocumentView()', function (newVal) {
        $scope.tableView = newVal;
    });


    $scope.selectedFile = function (file) {
        if(selectedFiles.indexOf(file) > -1) {
            selectedFiles.splice(selectedFiles.indexOf(file), 1);
        } else {
            selectedFiles.push(file);
        }

        if(selectedFiles.length > 0) {
            $scope.isEditing = true;
            $state.go('declaration.show.documents.edit');
        } else  {
            $scope.isEditing = false;
            $state.go('declaration.show.documents');
        }
    }

    $scope.openFile = function(file) {
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
        documentService.createThumbnail(node.parentNodeRef,node.nodeRef).then(function(response) {
            console.log(response);
        });
    }

}