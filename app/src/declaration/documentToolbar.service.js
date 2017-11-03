'use strict';

angular.module('openDeskApp.declaration').factory('documentToolbarService', function (authService,preferenceService) {
    var toggleIcon = 'list';
    var currentCase = {};

    var currentUser = authService.getUserInfo().user;

    var tableView = false;

    preferenceService.getPreferences(currentUser.userName,'dk.magenta.sites.retspsyk.tableView').then(function(response) {
        tableView = response['dk.magenta.sites.retspsyk.tableView'] == 'true' ? true : false;
    });

    var service = {
        toggleDocumentView: toggleDocumentView,
        getToggleIcon: getToggleIcon,
        getDocumentView: getDocumentView,
    };

    return service;

    function toggleDocumentView() {
        console.log(tableView);
        tableView = !tableView;

        preferenceService.setPreferences(currentUser.userName,{"dk.magenta.sites.retspsyk.tableView" : tableView});
        toggleIcon = tableView ? 'view_module' : 'list';
    }

    function getToggleIcon() {
        return toggleIcon;
    }

    function getDocumentView() {
        return tableView;
    }
});