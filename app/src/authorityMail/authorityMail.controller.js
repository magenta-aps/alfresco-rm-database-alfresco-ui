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



    vm.defaultBodyText = [
        {model : "ingen"},
        {model : "send"},
        {model : "returnering"}
    ];

    vm.selectedDefaultBody = "ingen";

  activated()



  function activated() {


    vm.selectedFiles.forEach(file => {
      vm.payload.nodeRefs.push(file.nodeRef);
    });
  }

  function propertyFilter(array, query) {
    return filterService.propertyFilter(array, query);
  }



  function getDefaultMailBody(decl, dropdown) {
      console.log("hvda er dropdown: " + dropdown);
      authorityMail.getDefaultMailBody(decl, dropdown).then( function(response) {
          vm.payload.body = response.text;
      });
  }

    $scope.$watch('vm.selectedDefaultBody', function (newVal) {
        console.log("hvad er newVal" + newVal)
        if (newVal == "ingen") {
            vm.payload.body = "";
        }
        else {
            getDefaultMailBody(vm.payload.caseid, vm.selectedDefaultBody);
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

