'use strict';

angular.module('openDeskApp.declaration').factory('entryService', function ($http, $window, $transitions, alfrescoNodeUtils) {

    var edit = false;
    var newCase = {};
    var currentCase = {};
    var caseTitle = '';
    var loading = true;

    function setCaseTitle(newCase) {
        caseTitle = newCase.firstName + ' ' + newCase.lastName + ' (erklæring #' + newCase.caseNumber + ')';
    }

    function formatCase(res) {
        angular.forEach(res, function (value, key) {
            if (value == 'null') {
                delete res[key];
            }
        });

        return res;
    }

    return {
        toggleEdit: function (state) {
            edit = state;
        },

        isEditing: function () {
            return edit;
        },
        
        setLoading: function(state) {
            loading = state;
        },

        isLoading: function() {
            return loading;
        },

        setCurrentCaseAfterCreation: function (newCase) {
            currentCase = formatCase(newCase);
            setCaseTitle(currentCase);
        },

        getCurrentCase: function () {
            return currentCase;
        },

        updateNewCase: function (caseUpdate) {
            newCase = caseUpdate;
        },

        getNewCaseInfo: function () {
            return newCase;
        },

        getCaseTitle: function () {
            return caseTitle;
        },

        getEntry: function (caseNumber) {
            return $http.get("/alfresco/s/database/retspsyk/entry/" + caseNumber, {}).then(function (response) {
                var res = response.data;
                setCaseTitle(res);
                currentCase = formatCase(res);
                return res;
            });
        },

        getAllEntries: function () {
            return $http.get("/alfresco/s/database/retspsyk/entries", {}).then(function (response) {
                return response.data;
            });
        },

        updateEntry: function (properties) {
            return $http.put("/alfresco/s/entry/" + properties['node-uuid'], {
                "properties": properties
            }).then(function (response) {
                setCaseTitle(response.data);
                var res = formatCase(response.data);
                return res;
            });
        },

        createEntry: function (properties) {
            return $http.post("/alfresco/s/database/retspsyk/entry", {
                "type": "forensicPsychiatryDeclaration",
                "properties": properties
            }).then(function (response) {
                console.log(response.data);
                return response.data;

            });
        },

        unlockEntry: function(properties) {
            return $http.put("/alfresco/s/entry/" + properties['node-uuid'] + '/unlock').then(function (response) {
                console.log(response);
            });
        },

        getContents: function (node) {
            return $http.get("/alfresco/service/contents?node=" + node).then(function (response) {
                return response.data;
            });
        },
    };
});