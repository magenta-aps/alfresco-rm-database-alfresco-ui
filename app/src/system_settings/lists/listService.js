'use strict';

angular.module('openDeskApp.declaration')
.factory('listService', function ($http) {

    var edit = false;

    return {
        toggleEdit: function () {
            edit = !edit;
        },

        forceEdit: function (state) {
            edit = state;
        },

        isEditing: function () {
            return edit;
        },

    };
});