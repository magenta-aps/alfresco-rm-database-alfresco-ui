angular.module('openDeskApp.declaration').factory('practitionerService', function () {
    var isEditing = false;
    var users = {};
    var usersBeforeEdit = {};

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
        }
    }

});