'use strict';

angular
  .module('openDeskApp.declaration')
  .controller('DeclarationCreateController', DeclarationCreateController);

function DeclarationCreateController($scope, $state, $translate, DeclarationService, propertyService, filterService, cprService, Toast, HeaderService) {

  var vm = this;

  $scope.editPatientData = true;
  $scope.case = {};
  $scope.case.biDiagnoses = [];
  $scope.case.creationDate = new Date();
  $scope.propertyValues = propertyService.getAllPropertyValues();
  $scope.propertyFilter = propertyFilter;
  $scope.addNewBidiagnosis = addNewBidiagnosis;
  vm.lookupCPR = lookupCPR;
  vm.hej = hej;

  HeaderService.resetActions();
  HeaderService.addAction('Gem', 'save', submit);

  activated();

  function hej() {
    alert("hej");
  }

  function activated() {
    var title = $state.current.name === 'declaration.create-bua' ? 'DECLARATION.NEW_BUA_DECLARATION' : 'DECLARATION.NEW_DECLARATION';
    HeaderService.setTitle($translate.instant(title));
  }

  function propertyFilter(array, query) {
    return filterService.propertyFilter(array, query);
  }

  function addNewBidiagnosis() {
    if ($scope.case.biDiagnoses.indexOf(null) < 0) {
      $scope.case.biDiagnoses.push(null);
    }
  }

  function lookupCPR() {
    cprService.getCPRData($scope.case.cprNumber)
      .then(function (response) {
        var name = response.NAVN.split(',');
        $scope.case.firstName = name[1];
        $scope.case.lastName = name[0];
        $scope.case.address = response.GADE;
        $scope.case.postbox = response.POSTNR;
        $scope.case.city = response.BY;
      });
  }

  function submit() {
    var newCase = {
      bua: $state.current.name === 'declaration.create-bua' ? true : false,
      properties: $scope.case
    }

    newCase.properties.fullName = newCase.properties.firstName + ' ' + newCase.properties.lastName;

    DeclarationService.create(newCase)
      .then(function (response) {
        $state.go('declaration.show.patientdata', { caseid: response.caseNumber, caseData: response });

        Toast.show('Sagen er oprettet');
      });
  }
}