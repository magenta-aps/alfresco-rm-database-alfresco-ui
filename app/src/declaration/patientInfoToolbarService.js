angular.module('openDeskApp.declaration').factory('patientInfoToolbarService', function () {
    var edit = false;

    return {
        toggleEdit: function() {
            edit = !edit;
        },

        isEditing: function() {
            return edit;
        },
    }

});