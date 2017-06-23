'use strict';

angular
    .module('openDeskApp.declaration')
    .controller('DeclarationCreateController', DeclarationCreateController);

function DeclarationCreateController($q, $mdDialog, $state, $mdToast, $scope, declarationService) {

    var pdc = this;

    pdc.openDeclarationCreateDialog = openDeclarationCreateDialog;

    pdc.test = function test() {
        alert("test");
    }

    function openDeclarationCreateDialog(ev) {
        $mdDialog.show({
            controller: DeclarationCreateController,
            templateUrl: 'app/src/declaration/view/create.html',
            locals: {
                var1: "type"
            },
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            preserveScope: true,
            scope: $scope
        });
    }

    function DeclarationCreateDiaglogController(sitetype, $scope, notificationsService, authService) {

        var currentUser = authService.getUserInfo().user;
        var availOwners = [];
    }


    $scope.submit = function () {
        declarationService.createCase();
    };



}