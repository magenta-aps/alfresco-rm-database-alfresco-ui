'use strict';

angular
  .module('oda.authorityMail')
  .controller('AuthorityMailController', AuthorityMailController);

function AuthorityMailController($scope, $mdDialog, Toast, authorityMail, propertyService, filterService, $stateParams, $state ) {
  var vm = this;

  vm.payload = {};
  vm.payload.nodeRefs = [];
  vm.payload.defaultbody = false;
  vm.payload.useSignature = false;


  vm.selectedFiles = $scope.selectedContent;


  vm.properties = propertyService.getAllPropertyValues();

  vm.propertyFilter = propertyFilter;
  vm.send = send;
  vm.cancel = cancel;
  vm.loading = false;
  vm.showSignitureCheckBox = false;

  vm.payload.caseid = $stateParams.caseid;


    if (Object.keys($stateParams.emailPayload).length !== 0) {
        vm.payload.subject = $stateParams.emailPayload.subject;
        vm.payload.authority = $stateParams.emailPayload.authority;
        vm.payload.body = $stateParams.emailPayload.body;
    }
  activated()

  checkSignitureAvailibility();



    vm.defaultBodyText = [
        {model : "ingen"},
        {model : "send"},
        {model : "returnering"}
    ];

    vm.selectedDefaultBody = "ingen";




  function preview() {
      authorityMail.getPreview(vm.payload).then( function (response) {
      $state.go('document', { doc: response.data.previewNode, tmpcrumb: $scope.crumbs, tmpNodeRef: $scope.folderUuid, showBackToEmail : true, emailPayload : vm.payload, selectedFiles : vm.selectedFiles });
      });
  }
  vm.preview = preview;

  function activated() {
    vm.selectedFiles.forEach(file => {
     vm.payload.nodeRefs.push(file.nodeRef);
    });
  }

  function propertyFilter(array, query) {
    return filterService.propertyFilter(array, query);
  }



  function getDefaultMailBody(decl, dropdown) {
      authorityMail.getDefaultMailBody(decl, dropdown).then( function(response) {
          vm.payload.body = response.text;
      });
  }

    $scope.$watch('vm.selectedDefaultBody', function (newVal) {
        if (newVal == "ingen") {
            vm.payload.body = "";
        }
        else {
            if ((Object.keys($stateParams.emailPayload).length !== 0)) {
                // do nothing
            }
            else {
                vm.payload.body = "";
            }
            getDefaultMailBody(vm.payload.caseid, vm.selectedDefaultBody);
        }
    })

    vm.payload.defaultbody


    $scope.$watch('vm.payload.useSignature', function (newVal) {
        if (newVal) {
            // console.log(newVal);
        }
        else {
            // console.log(newVal);
        }
    })



  function send() {
    vm.loading = true;

    return authorityMail.send(vm.payload)
      .then(function (response) {
        vm.loading = false;
        vm.cancel();
        Toast.show('Mailen blev sendt');
        // $state.reload();
          return response;
      });

  }

  function previewAddSigniture() {



  }

  function cancel() {
    $mdDialog.cancel();
  }

    function checkSignitureAvailibility() {
      authorityMail.areSignituresAvailable($stateParams.caseid, vm.selectedFiles).then(function(response) {
          vm.showSignitureCheckBox = response.data.available;
      })
    }



}


