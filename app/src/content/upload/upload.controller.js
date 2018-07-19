'use strict';

angular
    .module('oda.content')
    .controller('UploadController', UploadController);

function UploadController($rootScope, $mdDialog, ContentService) {

    var vm = this;
    var currentFolderNodeRef = ContentService.getCurrentFolderNodeRef();

    vm.cancelDialog = cancelDialog;
    vm.upload = uploadFiles;
    vm.openDialog = openDialog;
    vm.files = [];
    vm.uploading = false;

    function uploadFiles() {
        vm.uploading = true;

        angular.forEach(vm.files, function (file) {
            ContentService.uploadFiles(file, currentFolderNodeRef)
                .then(function () {
                    vm.uploading = false;
                    cancelDialog();
                });
        });

        vm.files = [];
    }

    function openDialog() {
        $mdDialog.show({
            templateUrl: 'app/src/content/upload/upload.view.html',
            controller: 'UploadController as vm',
            clickOutsideToClose: true
        });
    }

    function cancelDialog() {
        $rootScope.$broadcast('updateFilebrowser');
        $mdDialog.cancel();
        vm.files = [];
    }
}
