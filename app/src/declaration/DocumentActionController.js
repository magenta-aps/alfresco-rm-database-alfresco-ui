angular
    .module('openDeskApp.declaration')
    .controller('DocumentActionController', DocumentActionController);

function DocumentActionController($scope, $state, $mdDialog, declarationService, documentService) {
    var vm = this;

    $scope.declarationService = declarationService;
    $scope.selectedFiles = documentService.getSelectedFiles();
    $scope.case = {};

    $scope.$watch('declarationService.getCurrentCase()', function (newVal) {
        $scope.case = newVal;
    });

    vm.upload = function (files) {
        var caseNodeRef = $scope.case['store-protocol'] + '://' + $scope.case['store-identifier'] + '/' + $scope.case['node-uuid'];
        for (var i = 0; i < files.length; i++) {
            documentService.uploadFiles(files[i], caseNodeRef).then(function (response) {
                declarationService.getContents($scope.case['node-uuid']).then(function (response) {
                    documentService.setCaseFiles(response);
                });
            });
        }
        $mdDialog.cancel();
    };

    vm.deleteFiles = function () {
        $scope.selectedFiles.forEach(function (file) {
            documentService.deleteFile(file.nodeRef).then(function (response) {
                declarationService.getContents($scope.case['node-uuid']).then(function (response) {
                    documentService.setCaseFiles(response);
                });
            });
        });
        $state.go('declaration.show.documents');
        $mdDialog.cancel();
    }

}