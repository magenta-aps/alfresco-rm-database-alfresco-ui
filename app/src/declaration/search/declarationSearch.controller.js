'use strict';

angular
  .module('openDeskApp.declaration')
  .controller('DeclarationSearchController', DeclarationSearchController);

function DeclarationSearchController($scope, $state, DeclarationService, authService, HeaderService) {

  var vm = this;

  $scope.selectedCase = null;
  vm.getEntries = getEntries;

  activated();

  $scope.$watch('selectedCase', function (newCase) {
    if (newCase) {
      $state.go('declaration.show', { caseid: newCase.caseNumber });
    }
  }, true);


  function activated() {
    HeaderService.setTitle('');
    HeaderService.resetActions();

    var roles = authService.getUserRoles();
    if (!(roles.indexOf("SiteConsumer") > -1)) {
      HeaderService.addAction('DECLARATION.NEW_BUA_DECLARATION', 'add', createNewBuaDeclaration);
      HeaderService.addAction('DECLARATION.NEW_DECLARATION', 'add', createNewDeclaration, true);
    }

  }

  function getEntries(query) {
    return DeclarationService.getAutoComleteEntries(0, 5, query)
      .then(function (response) {
        return response.entries;
      })
  }

  function createNewDeclaration() {
    $state.go('declaration.create');
  }

  function createNewBuaDeclaration() {
    $state.go('declaration.create-bua');
  }
}