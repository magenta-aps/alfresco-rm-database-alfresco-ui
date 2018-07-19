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
        var destination = ContentService.getCurrentFolderNodeRef();
        ContentService.createFolder(vm.folderName, destination)
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