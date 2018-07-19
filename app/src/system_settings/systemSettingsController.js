'use strict';

angular
    .module('openDeskApp.systemsettings')
    .controller('SystemSettingsController', SystemSettingsCtrl);

function SystemSettingsCtrl($scope, $state, systemSettingsPagesService, sessionService, authService) {
    var vm = this;

    $scope.templateSites = [];

    vm.viewState = viewState;

    //sets the margin to the width of sidenav
    var sidebar = $(".md-sidenav-left");
    $(".od-info-declarations").css("margin-left", sidebar.width()+"px");
    
    function viewState(newState) {
        $state.go('administration.' + newState);
    }

    function getUserRoles () {
        $scope.userRoles = authService.getUserRoles();
    }
    getUserRoles();

    vm.isAdmin = sessionService.isAdmin();

    vm.pages = systemSettingsPagesService.getPages()
        .filter(function (page) {
            return true;
        });
}