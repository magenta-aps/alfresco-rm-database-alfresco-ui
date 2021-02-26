'use strict';

angular
  .module('oda.authorityMail')
  .controller('AuthorityMailController', AuthorityMailController);

function AuthorityMailController($scope, $mdDialog, Toast, authorityMail, propertyService, filterService, $stateParams, $state ) {
  var vm = this;

  vm.payload = {};
  vm.payload.nodeRefs = [];
  vm.payload.defaultbody = false;

  vm.selectedFiles = $scope.selectedContent;


  vm.properties = propertyService.getAllPropertyValues();

  vm.propertyFilter = propertyFilter;
  vm.send = send;
  vm.cancel = cancel;
  vm.loading = false;

  vm.payload.caseid = $stateParams.caseid;

  activated()

  function activated() {


    vm.selectedFiles.forEach(file => {
      vm.payload.nodeRefs.push(file.nodeRef);
    });
  }

  function propertyFilter(array, query) {
    return filterService.propertyFilter(array, query);
  }



  function getDefaultMailBody(decl) {
      authorityMail.getDefaultMailBody(decl).then( function(response) {
          vm.payload.body = response.text;
      });
  }

    $scope.$watch('vm.payload.defaultbody', function (newVal) {
        if (newVal) {
            getDefaultMailBody(vm.payload.caseid);
        }
        else {
            vm.payload.body = "";
        }
    })

    vm.payload.defaultbody

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

