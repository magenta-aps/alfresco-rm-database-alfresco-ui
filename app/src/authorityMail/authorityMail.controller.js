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

  vm.payload.caseid = $stateParams.caseid;

    if (Object.keys($stateParams.emailPayload).length !== 0) {
        vm.payload.subject = $stateParams.emailPayload.subject;
        vm.payload.authority = $stateParams.emailPayload.authority;
        vm.payload.body = $stateParams.emailPayload.body;
    }
  activated()


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

            if ((Object.keys($stateParams.emailPayload).length !== 0)) {
                // do nothing
            }
            else {
                vm.payload.body = "";
            }

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

  function previewAddSigniture() {



  }

  function cancel() {
    $mdDialog.cancel();
  }

}

