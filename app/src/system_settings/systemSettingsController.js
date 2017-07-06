angular
    .module('openDeskApp.systemsettings')
    .controller('SystemSettingsController', SystemSettingsCtrl);

function SystemSettingsCtrl($scope, $state, $stateParams, systemSettingsPagesService, sessionService, systemSettingsService) {
    var vm = this;

    $scope.templateSites = [];

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

    $scope.viewEthnicities = function() {
        $state.go('administration.systemsettings.ethnicities');
    }

    function loadTemplates() {

        systemSettingsService.getTemplates().then (function(response) {
            console.log(response)
            $scope.templateSites = response;
        });
    }
    loadTemplates();

    vm.isAdmin = sessionService.isAdmin();

    systemSettingsService.getDocumentTemplateSite().then(function (response) {
        vm.shortName = response.shortName;
    });

    vm.pages = systemSettingsPagesService.getPages()
        .filter(function (page) {
            return true;
        });
}