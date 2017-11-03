'use strict';

angular
    .module('openDeskApp.filebrowser')
    .controller('UploadController', UploadController);

function UploadController($rootScope, $mdDialog, Upload, filebrowserService) {


    var vm = this;
    var currentFolderNodeRef = filebrowserService.getCurrentFolderNodeRef();

    vm.cancelDialog = cancelDialog;
    vm.uploadFiles = uploadFiles;
    vm.files = [];

    function uploadFiles() {
        vm.uploading = true;

        angular.forEach(vm.files, function (file) {
            filebrowserService.uploadFiles(file, currentFolderNodeRef).then(function (response) {
                vm.uploading = false;
                cancelDialog();
            });
        });

        vm.files = [];
    }

    function cancelDialog() {
        $rootScope.$broadcast('updateFilebrowser');
        $mdDialog.cancel();
        vm.files = [];
    }

}