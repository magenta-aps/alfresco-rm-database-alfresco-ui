angular
    .module('openDeskApp.declaration')
    .controller('DocumentController', DocumentController);

function DocumentController($scope, $state, declarationService, documentToolbarService) {
    var vm = this;

    $scope.documentToolbarService = documentToolbarService;
    $scope.declarationService = declarationService;

    $scope.contents = [];
    $scope.contentLength = 0;

    $scope.case = {};

    $scope.tableView = false;

     $scope.$watch('declarationService.getCurrentCase()', function (newVal) {
        $scope.case = newVal;
        if(newVal['node-uuid'])
            loadFiles($scope.case['node-uuid']);
    });

    $scope.$watch('documentToolbarService.getDocumentView()', function (newVal) {
        $scope.tableView = newVal;
    });


    $scope.editDocuments = function () {
        $state.go('declaration.show.documents.edit');
    }

    function loadFiles(node) {
        declarationService.getContents(node).then(function (response) {
            $scope.contents = response;
            $scope.contents.forEach(function (contentTypeList) {
                $scope.contentLength += contentTypeList.length;
            });
            console.log(response)
        });
    };

}