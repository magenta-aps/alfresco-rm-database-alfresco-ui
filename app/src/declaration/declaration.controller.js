'use strict';

angular
  .module('openDeskApp.declaration')
  .controller('DeclarationController', DeclarationController);

function DeclarationController($scope, propertyService) {

  var vm = this;

  //sets the margin to the width of sidenav
  var sidebar = $(".md-sidenav-left");
  $(".od-info-declarations").css("margin-left", sidebar.width() + "px");

  $scope.case = {};

  $scope.propertyValues = propertyService.getAllPropertyValues();
}