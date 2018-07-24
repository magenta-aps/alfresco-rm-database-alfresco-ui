'use strict';

angular
    .module('openDeskApp')
    .controller('HeaderController', HeaderController);

function HeaderController($scope, HeaderService) {

    var vm = this;

    vm.title = '';
    vm.actions = [];
    vm.isClosed = false;

    vm.canAccessSettings = canAccessSettings;
    vm.getUserName = getUserName;
    vm.logout = logout;

    $scope.$on('updateHeader', function () {
        updateHeaderTitle();
        updateHeaderActions();
        updateIsClosed();
    });

    function updateHeaderTitle() {
        vm.title = HeaderService.getTitle();
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
        return HeaderService.logout();
    }

    function updateIsClosed() {
        vm.isClosed = HeaderService.isClosed();
    }
}

