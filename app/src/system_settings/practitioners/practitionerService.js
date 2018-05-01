'use strict';

angular.module('openDeskApp.declaration').factory('practitionerService', function ($http, groupService) {
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
        getUserPermissions: getUserPermissions,
        getPermissionGroups: getPermissionGroups,
        activateUser: activateUser,
        deactivateUser: deactivateUser,
        isUserMember: isUserMember
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

    function getUserPermissions () {
        return $http.get('/alfresco/s/userpermissions')
            .then(function (response) {
                return response
            })
    }

    function getPermissionGroups() {
        return groupService.getGroupNamesForSite('retspsyk').then(function (response) {
            return response.permissionGroups;
        });
    }

    function activateUser(userName) {
        return $http.get(`alfresco/s/activateUser?userName=${userName}`).then(function (response) {
            return response
        })
    }

    function deactivateUser(userName) {
        return $http.get(`alfresco/s/deactivateUser?userName=${userName}`).then(function (response) {
            return response
        })
    }

    function isUserMember(userName) {
        return $http.get(`/api/people/${userName}/sites`).then(function (response) {
            var isMember = false
            response.data.forEach(site => {
                if( site.shortName === 'retspsyk') {
                    isMember = true
                }
            });
            return isMember
        })
    }
});