'use strict';

angular
    .module('oda.authorityMail')
    .controller('AuthorityMailController', AuthorityMailController);

function AuthorityMailController($mdDialog, authorityMail, documentService, propertyService) {
  var vm = this;

  vm.payload = {};
  vm.payload.nodeRefs = [];

  vm.selectedFiles = documentService.getSelectedFiles();
  vm.properties = propertyService.getAllPropertyValues();

  vm.send = send;
  vm.cancel = cancel;

  activated()

  function activated () {
    vm.selectedFiles.forEach(file => {
      vm.payload.nodeRefs.push(file.nodeRef);
    });
  }

  function send () {
    authorityMail.send();
  }

  function cancel() {
    $mdDialog.cancel();
  }

}