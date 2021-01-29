'use strict';

angular
    .module('openDeskApp')
    .controller('HeaderController', HeaderController);

function HeaderController($scope, HeaderService, authService, $state, $timeout) {

    var vm = this;

    vm.title = '';
    vm.caseId = 0;
    vm.actions = [];
    vm.isClosed = false;
    vm.loggedIn = false;
    vm.backtosearch = false;
    vm.backtosearchquery = "";

    vm.canAccessSettings = canAccessSettings;
    vm.getUserName = getUserName;
    vm.logout = logout;


    $scope.$on('updateHeader', function () {
        updateHeaderTitle();
        updateCaseId();
        updateHeaderActions();
        updateIsClosed();
        isLoggedIn();
        vm.backtosearch = HeaderService.getBackToSearchStatus();
        vm.backtosearchquery = HeaderService.getBackToSearchQuery();

    });

    function gobacktosearch() {
        HeaderService.setBacktosearchStatus(false);
        $timeout(function () {
            $state.go('declaration.advancedSearch', {searchquery: vm.backtosearchquery});
        });
    }
        vm.gobacktosearch = gobacktosearch;

    function flowchart() {
        $timeout(function() {
            $state.go('flowchart', { declarationShortcutId: null })}
        )}
	vm.flowchart = flowchart;

    function isLoggedIn() {
        vm.loggedIn = authService.loggedin();
    }

    function updateHeaderTitle() {
        vm.title = HeaderService.getTitle();
    }

    function updateCaseId() {
        vm.caseId = HeaderService.getCaseId();
    }

    function updateHeaderActions() {
        vm.actions = HeaderService.getActions();
    }

    function getUserName() {
        return HeaderService.getUserName();
    }

    function canAccessSettings() {
        return HeaderService.canAccessSettings();
    }

    function logout() {
        return authService.logout();
    }

    function updateIsClosed() {
        vm.isClosed = HeaderService.isClosed();
    }
}

