'use strict';

angular
    .module('openDeskApp.filebrowser')
    .controller('DeleteContentController', DeleteContentController);

function DeleteContentController($scope, $mdDialog) {
    var vm = this;

    vm.deleteFile = deleteFile;

    function deleteFile(nodeRef) {
        documentService.deleteFile(nodeRef).then(function (response) {
            cancelDialog();
        });
    }
}