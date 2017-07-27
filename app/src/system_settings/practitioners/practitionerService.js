angular.module('openDeskApp.declaration').factory('practitionerService', function (groupService) {
    var isEditing = false;
    var users = {};
    var usersBeforeEdit = {};
    var permissionGroups = [];

    return {
        setEdit: function(state) {
            isEditing = state;
        },

        isEditing: function() {
            return isEditing;
        },

        updateUsers: function(update) {
            users = update;
        },

        setUsersBeforeEdit: function(save) {
            usersBeforeEdit = angular.copy(save);
        },

        getOriginalUsers: function() {
            return usersBeforeEdit;
        },

        getUpdatedUsers: function() {
            return users;
        },

        getPermissionGroups: function() {
            return groupService.getGroupNamesForSite('retspsyk').then(function (response) {
                return response.permissionGroups;
            })
        }
    }

});