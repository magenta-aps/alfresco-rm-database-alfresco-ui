angular
    .module('openDeskApp.systemsettings')
    .controller('SystemSettingsController', SystemSettingsCtrl);

function SystemSettingsCtrl($scope, $state, $stateParams, systemSettingsPagesService, sessionService, authService, systemSettingsService) {
    var vm = this;

    $scope.templateSites = [];

    $scope.auth = {};

    //sets the margin to the width of sidenav
    var sidebar = $(".md-sidenav-left");
    $(".od-info-declarations").css("margin-left", sidebar.width()+"px");

    $scope.viewDashboard = function() {
        $state.go('administration.systemsettings.dashboard');
    }

    $scope.viewPractitioners = function() {
        $state.go('administration.systemsettings.practitioners');
    }

    $scope.viewDiagnosis = function() {
        $state.go('administration.systemsettings.diagnosis');
    }

    $scope.viewState = function(newState) {
        $state.go('administration.systemsettings.' + newState);
    }

    $scope.getUserRoles = function() {
        return authService.getUserRoles();
    }

    function loadTemplates() {

        systemSettingsService.getTemplates().then (function(response) {
            console.log(response)
            $scope.templateSites = response;
        });
    }
    //loadTemplates();

    vm.isAdmin = sessionService.isAdmin();

    function isAuthorized() {

        console.log('is authorized');
        var authRoles = $stateParams.authorizedRoles;
        console.log(authRoles);

        for(var i=0; i < authRoles.length; i++) {
            $scope.auth[authRoles[i]] = authService.isAuthorized(authRoles[i]);
            console.log(authRoles[i]);
        }
        console.log($scope.auth);
    }
    isAuthorized();

    // systemSettingsService.getDocumentTemplateSite().then(function (response) {
    //     vm.shortName = response.shortName;
    // });

    vm.pages = systemSettingsPagesService.getPages()
        .filter(function (page) {
            return true;
        });
}