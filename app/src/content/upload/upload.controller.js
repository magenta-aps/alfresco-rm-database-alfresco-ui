'use strict';

angular
    .module('oda.content')
    .controller('UploadController', UploadController);

function UploadController($rootScope, $mdDialog, ContentService, $scope) {

    var vm = this;

    vm.cancelDialog = cancelDialog;
    vm.upload = uploadFiles;
    vm.uploadTemplateFiles = uploadTemplateFiles;
    vm.openDialog = openDialog;
    vm.openTemplateDialog = openTemplateDialog;
    vm.files = [];
    vm.uploading = false;

    function uploadFiles() {
        vm.uploading = true;

        angular.forEach(vm.files, function (file) {
            ContentService.uploadFiles(file)
                .then(function (response) {
                    vm.uploading = false;
                    cancelDialog();
                });
        });

        vm.files = [];
    }

    function uploadTemplateFiles() {

        vm.uploading = true;

        angular.forEach(vm.files, function (file) {
            ContentService.uploadTemplateFiles(file, null, $scope.template_type)
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

   function openTemplateDialog() {
        $mdDialog.show({
            templateUrl: 'app/src/content/upload/upload_template.view.html',
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
