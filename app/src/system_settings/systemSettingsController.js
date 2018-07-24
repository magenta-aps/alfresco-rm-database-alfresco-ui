'use strict';

angular
    .module('openDeskApp.systemsettings')
    .controller('SystemSettingsController', SystemSettingsCtrl);

function SystemSettingsCtrl($scope, $state, $translate, authService, HeaderService) {
    var vm = this;

    $scope.templateSites = [];

    vm.viewState = viewState;

    //sets the margin to the width of sidenav
    var sidebar = $(".md-sidenav-left");
    $(".od-info-declarations").css("margin-left", sidebar.width() + "px");

    HeaderService.resetActions();
    HeaderService.setTitle($translate.instant('ADMIN.ADMINISTRATION'));

    function viewState(newState) {
        $state.go('administration.' + newState);
        HeaderService.setTitle($translate.instant('ADMIN.ADMINISTRATION') + ' - ' + $translate.instant('ADMIN.' + newState.toUpperCase()));
    }

    function getUserRoles() {
        $scope.userRoles = authService.getUserRoles();
    }
    getUserRoles();
}