'use strict';

angular
    .module('openDeskApp.systemsettings')
    .controller('SystemSettingsController', SystemSettingsCtrl);

function SystemSettingsCtrl($scope, $translate, authService, HeaderService) {
    var vm = this;

    $scope.templateSites = [];

    vm.changePageHeading = changePageHeading;

    HeaderService.resetActions();
    HeaderService.setTitle($translate.instant('ADMIN.ADMINISTRATION'));

    function changePageHeading(newState) {
        HeaderService.setTitle($translate.instant('ADMIN.ADMINISTRATION') + ' - ' + $translate.instant('ADMIN.' + newState.toUpperCase()));
    }

    function getUserRoles() {
        $scope.userRoles = authService.getUserRoles();
    }
    getUserRoles();
}