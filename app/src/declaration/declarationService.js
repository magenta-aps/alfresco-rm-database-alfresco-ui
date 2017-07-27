'use strict';

angular.module('openDeskApp.declaration').factory('declarationService', function ($http, $window, $transitions, alfrescoNodeUtils) {

    var edit = false;
    var newCase = {};
    var currentCase = {};
    var caseTitle = '';
    var dropdownGroupNames = {};
    var dropdownGroupOptions = {};

    function setCaseTitle(newCase) {
        caseTitle = newCase.firstName + ' ' + newCase.lastName + ' (Sag #' + newCase.caseNumber + ')';
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
        toggleEdit: function () {
            edit = !edit;
        },

        forceEdit: function (state) {
            edit = state;
        },

        isEditing: function () {
            return edit;
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

        getCase: function (caseNumber) {
            return $http.get("/alfresco/s/entry?type=forensicPsychiatryDeclaration&entryKey=caseNumber&entryValue=" + caseNumber, {}).then(function (response) {
                var res = response.data[0];
                setCaseTitle(res);
                currentCase = formatCase(res);
                return res;
            });
        },

        getAllCases: function () {
            return $http.get("/alfresco/s/entry?type=forensicPsychiatryDeclaration", {}).then(function (response) {
                return response.data;
            });
        },

        updateCase: function (properties) {
            return $http.put("/alfresco/s/entry?uuid=" + properties['node-uuid'], {
                "properties": properties
            }).then(function (response) {
                setCaseTitle(response.data);
                var res = formatCase(response.data);
                return res;
            });
        },

        createCase: function (properties) {
            return $http.post("/alfresco/s/entry", {
                "type": "forensicPsychiatryDeclaration",
                "siteShortName": "retspsyk",
                "properties": properties
            }).then(function (response) {
                console.log(response.data);
                return response.data;

            });
        },

        getContents: function (node) {
            return $http.get("/alfresco/service/contents?node=" + node).then(function (response) {
                return response.data;
            });
        },

        getPropertyValues: function () {
            return $http.get("/alfresco/s/propertyValues").then(function (response) {
                dropdownGroupOptions = response.data;
                return response.data;
            });
        },

        setPropertyValues: function (property, values) {
            return $http.put("/alfresco/s/propertyValues", {
                "property": property,
                "values": values,
            }).then(function (response) {
                return response.data;
            });
        },

        getDropdownOptions: function (groupName) {
            return dropdownGroupOptions[groupName];
        },

        getAllDropdownOptions: function () {
            return dropdownGroupOptions;
        }

    };
});