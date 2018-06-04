'use strict';

angular
    .module('oda.authorityMail')
    .controller('AuthorityMailController', AuthorityMailController);

function AuthorityMailController($mdDialog, authorityMail, documentService, propertyService, filterService) {
  var vm = this;

  vm.payload = {};
  vm.payload.nodeRefs = [];

  vm.selectedFiles = documentService.getSelectedFiles();
  vm.properties = propertyService.getAllPropertyValues();

  vm.propertyFilter = propertyFilter;
  vm.send = send;
  vm.cancel = cancel;

  activated()

  function activated () {
    vm.selectedFiles.forEach(file => {
      vm.payload.nodeRefs.push(file.nodeRef);
    });
  }

  function propertyFilter(array, query) {
    return filterService.propertyFilter(array, query);
}

  function send () {
    authorityMail.send(vm.payload).then(function () {
      vm.cancel();
    })
  }

  function cancel() {
    $mdDialog.cancel();
  }

}