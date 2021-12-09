'use strict';

angular
  .module('openDeskApp.declaration')
  .controller('DeclarationController', DeclarationController);

function DeclarationController($scope, propertyService, $rootScope) {
  $scope.case = {};
  $scope.propertyValues = propertyService.getAllPropertyValues();


  // $scope.duf = "declarationController1";


  // lav en watcher som tjekker rootscope.duff og sætter scope.duf til den nye værdi.


  function clearList() {
    console.log("clicked clearList")
    $rootScope.duf = null;
  }
  $scope.clearList = clearList;

  $scope.showMailAttachments = false;

  $rootScope.$watch('duf', function (newVal) {

    if (newVal) {
      console.log("der skete noget");
      console.log(newVal);
      $scope.duf = newVal;
      $scope.showMailAttachments = true;
    }
    else {
      $scope.duf = undefined;
      $scope.showMailAttachments = false;
    }


  });


}
