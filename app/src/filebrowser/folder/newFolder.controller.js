'use strict';

angular
    .module('openDeskApp.filebrowser')
    .controller('NewFolderController', NewFolderController);

function NewFolderController($mdDialog, filebrowserService) {
    var vm = this;

    vm.cancelDialog = cancelDialog;
    vm.createFolder = createFolder;
    vm.folderName = '';

    function cancelDialog() {
        $mdDialog.cancel();
    }

    function createFolder() {
        var destination = filebrowserService.getCurrentFolderNodeRef();

        filebrowserService.createFolder(vm.folderName,destination).then(function() {
            cancelDialog();
        });
    }
}