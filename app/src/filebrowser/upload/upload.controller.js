'use strict';

angular
    .module('openDeskApp.filebrowser')
    .controller('UploadController', UploadController);

function UploadController($scope, $rootScope, $mdDialog, Upload, siteService, filebrowserService) {


    var vm = this;

    vm.cancelDialog = cancelDialog;
    vm.uploadFiles = uploadFiles;

    function uploadFiles(files) {
        vm.uploading = true;

        angular.forEach(files, function (file) {
            // siteService.uploadFiles(file, folderNodeRef).then(function (response) {
            //     vm.uploading = false;
            //     //cancelDialog();
            // });
        });

        $scope.files = [];
    }

    function cancelDialog() {
        // $rootScope.$broadcast('updateFilebrowser');
        $mdDialog.cancel();
        $scope.files = [];
    }

}