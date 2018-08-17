'use strict';

angular
  .module('openDeskApp.declaration')
  .controller('PractitionerController', PractitionerController);

function PractitionerController($scope, practitionerService, Toast, HeaderService) {

  $scope.allUsers = [];

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

  activated();

  function activated() {
    practitionerService.getUserPermissions()
      .then(function (response) {
        $scope.allUsers = response.data;
      })
  }
}
