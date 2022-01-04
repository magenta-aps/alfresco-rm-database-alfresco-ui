'use strict';

angular
  .module('openDeskApp.declaration')
  .controller('DeclarationController', DeclarationController);

function DeclarationController($scope, propertyService, $state, $stateParams) {
  $scope.case = {};
  $scope.propertyValues = propertyService.getAllPropertyValues();

  function gotoDocuments() {
    console.log("dav");
    //$state.go('declaration.show.documents', {tmpNodeRef : null} );



      $state.go('declaration.show.documents', { breadcrumbPath: [], tmpNodeRef : null, emailPayload : null, }, {reload : true}).then(function(response) {console.log(response)});



  }
  $scope.gotoDocuments = gotoDocuments;


}
