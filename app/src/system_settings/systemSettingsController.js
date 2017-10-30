'use strict';

angular
    .module('openDeskApp.systemsettings')
    .controller('SystemSettingsController', SystemSettingsCtrl);

function SystemSettingsCtrl($scope, $state, $stateParams, systemSettingsPagesService, sessionService, authService, systemSettingsService) {
    var vm = this;

    $scope.templateSites = [];

    vm.viewDashboard = viewDashboard;
    vm.viewPractitioners = viewPractitioners;
    vm.viewState = viewState;

    //sets the margin to the width of sidenav
    var sidebar = $(".md-sidenav-left");
    $(".od-info-declarations").css("margin-left", sidebar.width()+"px");

    
    function viewDashboard() {
        $state.go('administration.systemsettings.dashboard');
    }

    
    function viewPractitioners() {
        $state.go('administration.systemsettings.practitioners');
    }
    
    function viewState(newState) {
        $state.go('administration.systemsettings.' + newState);
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