'use strict';

angular.module('openDeskApp.declaration').factory('practitionerService', function (groupService) {
    var isCurrentlyEditing = false;
    var users = {};
    var usersBeforeEdit = {};
    var permissionGroups = [];

    var service = {
        setEdit: setEdit,
        isEditing: isEditing,
        updateUsers: updateUsers,
        setUsersBeforeEdit: setUsersBeforeEdit,
        getOriginalUsers: getOriginalUsers,
        getUpdatedUsers: getUpdatedUsers,
        getPermissionGroups: getPermissionGroups,
    };

    return service;
    
    function setEdit(state) {
        isCurrentlyEditing = state;
    }

    function isEditing() {
        return isCurrentlyEditing;
    }

    function updateUsers(update) {
        users = update;
    }
    
    function setUsersBeforeEdit(save) {
        usersBeforeEdit = angular.copy(save);
    }

    function getOriginalUsers() {
        return usersBeforeEdit;
    }

    function getUpdatedUsers() {
        return users;
    }

    function getPermissionGroups() {
        return groupService.getGroupNamesForSite('retspsyk').then(function (response) {
            return response.permissionGroups;
        });
    }
});