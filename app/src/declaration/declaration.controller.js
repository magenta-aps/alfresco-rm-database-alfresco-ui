'use strict';

angular
  .module('openDeskApp.declaration')
  .controller('DeclarationController', DeclarationController);

function DeclarationController($scope, propertyService) {
  $scope.case = {};
  $scope.propertyValues = propertyService.getAllPropertyValues();
}