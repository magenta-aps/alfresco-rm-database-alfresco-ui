'use strict';

angular
    .module('oda.content')
    .controller('FolderController', FolderController);

function FolderController($mdDialog, ContentService) {
    var vm = this;

    vm.openDialog = openDialog;
    vm.cancelDialog = cancelDialog;
    vm.createFolder = createFolder;
    vm.folderName = '';

    function createFolder() {
        ContentService.createFolder(vm.folderName)
            .then(function () {
                cancelDialog();
            });
    }

    function cancelDialog() {
        $mdDialog.cancel();
    }

    function openDialog() {
        $mdDialog.show({
            templateUrl: 'app/src/content/folder/newFolder.view.html',
            controller: 'FolderController as vm',
            clickOutsideToClose: true
        });
    }
}