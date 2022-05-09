'use strict';

angular
    .module('openDeskApp.systemsettings')
    .controller('SystemSettingsController', SystemSettingsCtrl);

function SystemSettingsCtrl($scope, $translate, authService, HeaderService, $http) {
    var vm = this;

    $scope.templateSites = [];

    vm.changePageHeading = changePageHeading;
    vm.bua = true;

    isBUAUser();


    HeaderService.resetActions();
    HeaderService.setTitle($translate.instant('ADMIN.ADMINISTRATION'));

    function changePageHeading(newState) {
        HeaderService.setTitle($translate.instant('ADMIN.ADMINISTRATION') + ' - ' + $translate.instant('ADMIN.' + newState.toUpperCase()));
    }

    function getUserRoles() {
        $scope.userRoles = authService.getUserRoles();
    }
    getUserRoles();

    function isBUAUser() {
        return $http.get('/alfresco/s/usertype').then(function (response) {
            if (!response.data.bua) {
                vm.bua = false;
            };
        })
    }
}
