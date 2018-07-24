'use strict';

angular.module('openDeskApp.header').factory('HeaderService', HeaderService);

function HeaderService($rootScope, authService) {

    var headerTitle = '';
    var actions = [];
    var closed = false;

    var service = {
        setTitle: setTitle,
        getTitle: getTitle,
        addAction: addAction,
        getActions: getActions,
        resetActions: resetActions,
        setClosed: setClosed,
        isClosed: isClosed,
        canAccessSettings: canAccessSettings,
        getUserName: getUserName,
        logout: logout
    };

    return service;

    function getTitle() {
        return headerTitle;
    }

    function setTitle(newTitle) {
        headerTitle = newTitle;
        $rootScope.$broadcast('updateHeader');
    }

    function getActions() {
        return actions;
    }

    function resetActions() {
        actions = [];
        closed = false;
        $rootScope.$broadcast('updateHeader');
    }

    function addAction(label, icon, action, primary) {
        actions.push({
            label: label,
            icon: icon,
            primary: primary,
            action: action
        })
        $rootScope.$broadcast('updateHeader');
    }

    function setClosed(val) {
        closed = val;
        $rootScope.$broadcast('updateHeader');
    }

    function isClosed() {
        return closed;
    }

    function getUserName() {
        var user = authService.getUserInfo().user;
        return user.firstName + ' ' + user.lastName;
    }

    function canAccessSettings() {
        var roles = authService.getUserRoles();
        if (!roles) return false;

        if (roles.indexOf('SiteManager') > -1 ||
            roles.indexOf('SiteRoleManager') > -1 ||
            roles.indexOf('SitePropertyValueManager') > -1 ||
            roles.indexOf('SiteRoleManager') > -1 ||
            roles.indexOf('TemplateFolderValueManager') > -1) {
            return true;
        }
        return false;
    }




    function logout() {
        authService.logout();
    }
}