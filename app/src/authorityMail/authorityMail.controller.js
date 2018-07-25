'use strict';

angular
  .module('oda.authorityMail')
  .controller('AuthorityMailController', AuthorityMailController);

function AuthorityMailController($scope, $mdDialog, $mdToast, authorityMail, propertyService, filterService) {
  var vm = this;

  vm.payload = {};
  vm.payload.nodeRefs = [];

  vm.selectedFiles = $scope.selectedContent;
  vm.properties = propertyService.getAllPropertyValues();

  vm.propertyFilter = propertyFilter;
  vm.send = send;
  vm.cancel = cancel;
  vm.loading = false;

  activated()

  function activated() {
    vm.selectedFiles.forEach(file => {
      vm.payload.nodeRefs.push(file.nodeRef);
    });
  }

  function propertyFilter(array, query) {
    return filterService.propertyFilter(array, query);
  }

  function send() {
    vm.loading = true;
    authorityMail.send(vm.payload)
      .then(function () {
        vm.loading = false;
        vm.cancel();
        $mdToast.show(
          $mdToast.simple()
            .textContent('Mailen blev sendt')
            .position('top right')
            .hideDelay(3000)
        );
      })
  }

  function cancel() {
    $mdDialog.cancel();
  }

}