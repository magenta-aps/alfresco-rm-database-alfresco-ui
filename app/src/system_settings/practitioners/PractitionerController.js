'use strict';

angular
  .module('openDeskApp.declaration')
  .controller('PractitionerController', PractitionerController);

function PractitionerController($scope, practitionerService, Toast, HeaderService, $mdDialog, $stateParams, $state, USER_ROLES) {

  $scope.allUsers = [];

  $scope.bua = false;



  $scope.query = {
    order: 'firstName'
  };

  HeaderService.resetActions();


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

  console.log("init for stateparams");
  console.log($stateParams.onlyActive);
  console.log($stateParams.searchquery);

  if ( ($stateParams.searchquery === undefined) && ($stateParams.onlyActive === undefined) ) {

    console.log("doing init")
    $scope.searchParams_bua = "Alle";
    $scope.only_active = true;

    activated("Alle", true);
  }
  else {
    console.log("else");
    console.log($stateParams.onlyActive);
    console.log($stateParams.searchquery);

    $scope.searchParams_bua = $stateParams.searchquery;
    $scope.only_active = $stateParams.onlyActive;

    activated($stateParams.searchquery, $stateParams.onlyActive);
  }







  function updateBUA(user, firstName, lastName, oprettet) {

    $scope.selectedUser = user;
    $scope.selectedUserFirstName = firstName;
    $scope.selectedUserLastName = lastName;
    $scope.oprettet = oprettet;


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





  }

  $scope.updateBUA = updateBUA;

  function activated(val, only_active) {

    practitionerService.getUserPermissions(val, only_active)
      .then(function (response) {
        $scope.allUsers = response.data;
      })
  }

  function updateUser() {

    practitionerService.updateUser($scope.bua, $scope.selectedUser)
        .then(function (response) {

          var buaValue = $scope.searchParams_bua;


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

  function reloadWithNewValue(value) {
    console.log("reloading with value");
    console.log(value);

    console.log("hvad er only_active");
    console.log($scope.only_active);

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

    // $state.go('administration.practitioners', { searchquery: value });
  }

  $scope.reloadWithNewValue = reloadWithNewValue;

}
