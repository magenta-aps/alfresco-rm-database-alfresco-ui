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

    function fixNullAndJson(res) {
        angular.forEach(res, function (value, key) {
            if (value == 'null') {
                res[key] = null;
            }
        });

        if (res.bidiagnoses != null) {
            res.bidiagnoses = JSON.parse(res.bidiagnoses);
        }

        return res;
    }

    function addWaitingTimes(res) {
        var creationDate = new Date(res.creationDate);
        var observationDate = new Date(res.observationDate);
        var declarationDate = new Date(res.declarationDate);

        res.passiveWait = Math.ceil((observationDate - creationDate) / 1000 / 60 / 60 / 24);
        res.activeWait = Math.ceil((declarationDate - observationDate) / 1000 / 60 / 60 / 24);
        res.totalWait = Math.ceil((declarationDate - creationDate) / 1000 / 60 / 60 / 24);

        return res;
    }

    function formatCase(res) {
        res = fixNullAndJson(res);
        res = addWaitingTimes(res);
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
            newCase = addWaitingTimes(caseUpdate);
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
            angular.forEach(properties, function (value, key) {
                if (value != null && typeof value == "object" && typeof value.getMonth != 'function') {
                    properties[key] = JSON.stringify(properties[key])
                }
            });

            return $http.post("/alfresco/s/entry", {
                "type": "forensicPsychiatryDeclaration",
                "siteShortName": "retspsyk",
                "properties": properties
            }).then(function (response) {
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