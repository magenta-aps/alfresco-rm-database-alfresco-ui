'use strict';

angular
    .module('openDeskApp.declaration')
    .controller('DeclarationCreateToolbarController', DeclarationCreateToolbarController);

function DeclarationCreateToolbarController($state, $mdToast, entryService, authService) {

    var vm = this;

    vm.submit = submit;
    vm.createNewDeclaration = createNewDeclaration;
    vm.createNewBuaDeclaration = createNewBuaDeclaration;
    vm.canCreate = false;

    activated()

    function activated () {
        var roles = authService.getUserRoles();
        if (!(roles.indexOf("SiteConsumer") > -1)) {
            vm.canCreate = true
        }
    }
    
    function submit() {
        var newCase = entryService.getNewCaseInfo();
        newCase.fullName = newCase.firstName + ' ' + newCase.lastName;
        
        entryService.createEntry(newCase).then(function (response) {
            entryService.setCurrentCaseAfterCreation(response);
            $state.go('declaration.show.patientdata', {caseid: response.caseNumber});

            $mdToast.show(
                $mdToast.simple()
                .textContent('Erklæringen er oprettet')
                .position('top right')
                .hideDelay(3000)
            );
        });
    }
    
    function createNewDeclaration() {
        $state.go('declaration.create');
    }

    function createNewBuaDeclaration() {
        $state.go('declaration.create');
    }
}