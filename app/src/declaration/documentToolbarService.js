angular.module('openDeskApp.declaration').factory('documentToolbarService', function () {
    var tableView = false;
    var toggleIcon = 'list';
    var currentCase = {};

    return {
        toggleDocumentView: function() {
            tableView = !tableView;

            toggleIcon = tableView ? 'view_module' : 'list';
        },

        getToggleIcon: function() {
            return toggleIcon;
        },

        getDocumentView: function() {
            return tableView;
        },
    }

});