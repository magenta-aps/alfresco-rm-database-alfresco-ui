'use strict';

angular
    .module('openDeskApp.declaration')
    .controller('DocumentActionController', DocumentActionController);

function DocumentActionController($scope, $state, $mdDialog, $mdToast, entryService, documentService) {
    var vm = this;

    vm.uploadFiles = uploadFiles;
    vm.deleteFiles = deleteFiles;
    vm.cancelDialog = cancel;
    $scope.entryService = entryService;
    $scope.selectedFiles = documentService.getSelectedFiles();
    $scope.case = {};
    vm.files = [];

    $scope.$watch('entryService.getCurrentCase()', function (newVal) {
        $scope.case = newVal;
    });

    function uploadFiles() {
        var caseNodeRef = $scope.case['store-protocol'] + '://' + $scope.case['store-identifier'] + '/' + $scope.case['node-uuid'];
        angular.forEach(vm.files, function(file) {
            documentService.uploadFiles(file, caseNodeRef).then(function () {
                entryService.getContents($scope.case['node-uuid']).then(function (response) {
                    documentService.setCaseFiles(response);
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent('Filen er uploaded')
                        .position('top right')
                        .hideDelay(3000)
                    );
                });
            });
        });
        $scope.selectedFiles = [];
        documentService.resetSelectedFiles();
        $mdDialog.cancel();
    }

    
    function deleteFiles() {
        $scope.selectedFiles.forEach(function (file) {
            documentService.deleteFile(file.nodeRef).then(function (response) {
                entryService.getContents($scope.case['node-uuid']).then(function (response) {
                    documentService.setCaseFiles(response);
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent('Filen er slettet')
                        .position('top right')
                        .hideDelay(3000)
                    );
                });
            });
        });
        $state.go('declaration.show.documents');
        $mdDialog.cancel();
    }

    
    function cancel() {
        $mdDialog.cancel();
    }

}