'use strict';

angular
  .module('openDeskApp.declaration')
  .controller('PractitionerController', PractitionerController);

function PractitionerController($scope, practitionerService, Toast, HeaderService, $mdDialog, $stateParams, $state, USER_ROLES, sessionService, ContentService, $translate, authService) {

  $scope.allUsers = [];

  $scope.bua = false;
  $scope.signatureText = "";
  $scope.showCrop = false;
  $scope.elphoto = null;
  $scope.showCropFunction = false;
  $scope.showSignatureImage = true;

  // $scope.myImage = 'https://raw.githubusercontent.com/CrackerakiUA/ui-cropper/master/screenshots/live.jpg';
  $scope.myCroppedImage = ''; // in this variable you will have dataUrl of cropped area.


  $scope.query = {
    order: 'firstName'
  };

  HeaderService.resetActions();

  function startCrop() {
    $scope.showCropFunction = true;
    $scope.showSignatureImage = false;
  }

  $scope.startCrop = startCrop;


  function cropIt(vl) {
    $scope.showCropFunction = false;
    $scope.showSignatureImage = true;
    // $scope.elphoto = $scope.myCroppedImage;

    var data = $scope.myCroppedImage.replace(/^data:image\/\w+;base64,/, "");


    const base64 =  data;
    const imageName = 'names.png';
    const imageBlob = dataURItoBlob(base64);
    const imageFile = new File([imageBlob], imageName, { type: 'image/png' });

    ContentService.uploadFilesSetType(imageFile, $scope.destination, "rm:signature", $scope.selectedUser)
        .then(function (response) {
          vm.uploading = false;
          cancelDialog();
        });


  }
  $scope.cropIt = cropIt;


  getDestinationNodeRefSignatureFile("sd");

  $scope.$watch('allUsers', function (newVal, oldVal) {
    if (newVal.length == 0 || oldVal.length == 0) return;
    angular.forEach(newVal, function (user, i) {
      angular.forEach(user, function (value, key) {
        if (key !== '$$hashKey' && oldVal[i][key] !== value) {
          var addGroup = value ? [key] : [];
          var removeGroup = !value ? [key] : [];
          practitionerService.updateUserRoles(user.userName, addGroup, removeGroup)
          var msg = 'Rettighederne er blevet opdateret for ' + user.firstName + ' ' + user.lastName;
          Toast.show(msg)
        }
      })
    })
  }, true);

  $scope.$watch('only_active', function (newVal, oldVal) {

    //  otherwise it would fail, as a watch is always triggered twice. https://stackoverflow.com/questions/33105362/angular-scope-watch-newval-oldval
    if (newVal === oldVal) {
      return;
    }

    reloadWithNewValue($scope.searchParams_bua);
  }, true);


  // init - check if any values set in $stateParams

  if ( ($stateParams.searchquery === undefined) && ($stateParams.onlyActive === undefined) ) {

    $scope.searchParams_bua = "Alle";
    $scope.only_active = true;

    activated("Alle", true);
  }
  else {
    $scope.searchParams_bua = $stateParams.searchquery;
    $scope.only_active = $stateParams.onlyActive;
    activated($stateParams.searchquery, $stateParams.onlyActive);
  }



  function updateBUA(user, firstName, lastName, oprettet) {

    $scope.selectedUser = user;
    $scope.selectedUserFirstName = firstName;
    $scope.selectedUserLastName = lastName;
    $scope.oprettet = oprettet;

    practitionerService.getSignatureText($scope.selectedUser).then(function(response) {
      $scope.signatureText = response.data.text;

      if (response.data.nodeRef != undefined) {
        $scope.elphoto = '/alfresco/s/api/node/workspace/SpacesStore/' + response.data.nodeRef + '/content' + "?alf_ticket=" + authService.getUserInfo().ticket + "&random="  + Math.random();
      }
      else {
        $scope.elphoto = "";
      }

      // fetch current user status
      practitionerService.getUserType(user).then(function (response) {

        $scope.bua = response.data.result;



        $mdDialog.show({
          templateUrl: 'app/src/system_settings/practitioners/view/list-edit-user.html',
          scope: $scope, // use parent scope in template
          preserveScope: true, // do not forget this if use parent scope
          clickOutsideToClose: true
        });

      });


    });








  }

  $scope.updateBUA = updateBUA;

  function activated(val, only_active) {

    practitionerService.getUserPermissions(val, only_active)
      .then(function (response) {
        $scope.allUsers = response.data;
        console.log("hvad er response.data")
        console.log(response.data);
      })
  }

  function updateUser() {
    practitionerService.updateUserSignature($scope.bua, $scope.selectedUser, $scope.signatureText).then(function (response) {

          var buaValue = $scope.searchParams_bua;

          console.log("need to reload");

          try {
            $state.go('administration.practitioners', {
              authorizedRoles: [USER_ROLES.roleManager],
              searchquery: buaValue,
              onlyActive: $scope.only_active
            }, {reload: true});
          }
          catch(err) {
            console.log("err");
            console.log(err);
          }
        })

  }

  $scope.updateUser = updateUser;


  function uploadDialog() {
    $mdDialog.show({
      templateUrl: 'app/src/content/upload/upload.view.html',
      controller: 'UploadController as vm',
      destination: 'klap',
      clickOutsideToClose: true
    });
  }

  function uploadFiles() {
    vm.uploading = true;

    angular.forEach(vm.files, function (file) {
        ContentService.uploadFilesSetType(file, $scope.destination, "rm:signature", $scope.selectedUser)
            .then(function (response) {
              console.log("response tjek her")
              console.log(response)



              vm.uploading = false;
              vm.files = [];
              var buaValue = $scope.searchParams_bua;


              // mark the user as having a signature available
              practitionerService.markUserAsHavingASignature($scope.selectedUser).then(function (response) {
                try {
                  $state.go('administration.practitioners', {
                    authorizedRoles: [USER_ROLES.roleManager],
                    searchquery: buaValue,
                    onlyActive: $scope.only_active
                  }, {reload: true});
                }
                catch(err) {
                  console.log("err");
                  console.log(err);
                }
              });




              // cancelDialog();


          });
      });
  }

  var vm = this;
  vm.upload = uploadFiles;

  vm.signatureText = "";


  function openDialog() {
    $mdDialog.show({
      templateUrl: 'app/src/content/upload/upload.view.html',
      scope: $scope, // use parent scope in template
      preserveScope: true, // do not forget this if use parent scope
      clickOutsideToClose: true
    });
  }
  $scope.openDialog = openDialog;

  function cancelDialog() {
    $mdDialog.cancel();
    vm.files = [];
    $scope.elphoto = null;
  }
  $scope.cancelDialog = cancelDialog;


  function cancelEditDialog() {
    $mdDialog.cancel();
    $scope.elphoto = null;
  }
  $scope.cancelEditDialog = cancelEditDialog;




  function getDestinationNodeRefSignatureFile(usr) {

    var usrName = sessionService.getUserInfo().user.userName;

    practitionerService.getSignatureDest(usrName).then(function (response) {
      $scope.destination = response.data.nodeRef;
    })
  }

  $scope.getDestinationNodeRefSignatureFile = getDestinationNodeRefSignatureFile;

  function reloadWithNewValue(value) {

    try {
      $state.go('administration.practitioners', {
        authorizedRoles: [USER_ROLES.roleManager],
        searchquery: $scope.searchParams_bua,
        onlyActive: $scope.only_active
      }, {reload: true});
    }
    catch(err) {
      console.log("err");
      console.log(err);
    }
  }

  $scope.reloadWithNewValue = reloadWithNewValue;

  function dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });
    return blob;
  }

}
