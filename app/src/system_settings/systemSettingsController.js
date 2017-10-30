'use strict';

angular
    .module('openDeskApp.systemsettings')
    .controller('SystemSettingsController', SystemSettingsCtrl);

function SystemSettingsCtrl($scope, $state, $stateParams, systemSettingsPagesService, sessionService, authService, systemSettingsService) {
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

    function loadTemplates() {
        systemSettingsService.getTemplates().then (function(response) {
            $scope.templateSites = response;
        });
    }

    vm.isAdmin = sessionService.isAdmin();

    // systemSettingsService.getDocumentTemplateSite().then(function (response) {
    //     vm.shortName = response.shortName;
    // });

    vm.pages = systemSettingsPagesService.getPages()
        .filter(function (page) {
            return true;
        });
}