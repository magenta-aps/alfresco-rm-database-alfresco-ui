'use strict';

angular
  .module('oda.authorityMail')
  .controller('AuthorityMailController', AuthorityMailController);

function AuthorityMailController($scope, $mdDialog, Toast, authorityMail, propertyService, filterService, $stateParams, $state ) {
  var vm = this;

  vm.payload = {};
  vm.payload.nodeRefs = [];

  vm.selectedFiles = $scope.selectedContent;
  vm.properties = propertyService.getAllPropertyValues();

  vm.propertyFilter = propertyFilter;
  vm.send = send;
  vm.cancel = cancel;
  vm.loading = false;

  vm.payload.caseid = $stateParams.caseid;





  activated()

  function activated() {

      getDefaultMailBody();

    vm.selectedFiles.forEach(file => {
      vm.payload.nodeRefs.push(file.nodeRef);
    });
  }

  function propertyFilter(array, query) {
    return filterService.propertyFilter(array, query);
  }



  function getDefaultMailBody() {

      authorityMail.getDefaultMailBody().then( function(response) {
      console.log(response)

          vm.payload.body = response.text;

      });



  }

  function send() {
    vm.loading = true;
    authorityMail.send(vm.payload)
      .then(function () {
        vm.loading = false;
        vm.cancel();
        Toast.show('Mailen blev sendt');
        $state.reload()

      })
  }

  function cancel() {
    $mdDialog.cancel();
  }

}

