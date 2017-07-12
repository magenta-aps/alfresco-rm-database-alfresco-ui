'use strict';

angular.module('openDeskApp.declaration').factory('declarationService', function ($http, $window, alfrescoNodeUtils) {

    var edit = false;
    var newCase = {};
    var currentCase = {};
    var caseTitle = '';

    function setCaseTitle(newCase) {
        caseTitle = newCase.firstName + ' ' + newCase.lastName + ' (Sag #' + newCase.caseNumber + ')';
    }

    return {
        toggleEdit: function() {
            edit = !edit;
        },

        isEditing: function() {
            return edit;
        },

        setCurrentCase: function(newCase) {
            currentCase = newCase;
        },

        getCurrentCase: function() {
            return currentCase;
        },

        updateNewCase: function(caseUpdate) {
            newCase = caseUpdate;
        },

        getNewCaseInfo: function() {
            return newCase;
        },

        getCaseTitle: function() {
            return caseTitle;
        },

        getCase : function(caseNumber) {
            return $http.get("/alfresco/s/entry?type=forensicPsychiatryDeclaration&entryKey=caseNumber&entryValue=" + caseNumber, {}).then(function (response) {
                setCaseTitle(response.data[0]);
                return response.data;
            });
        },
        getAllCases : function() {
            return $http.get("/alfresco/s/entry?type=forensicPsychiatryDeclaration", {}).then(function (response) {
                console.log(response.data);
                return response.data;
            });
        },

        updateCase : function(caseNumber, properties) {
            return $http.put("/alfresco/s/entry?type=forensicPsychiatryDeclaration&entryKey=caseNumber&entryValue=" + caseNumber,
                            {"type":"forensicPsychiatryDeclaration",
                            "siteShortName" : "retspsyk",
                            "properties" : properties}).then(function (response) {

                return response.data;

            });
        },

        createCase : function(properties) {
            return $http.post("/alfresco/s/entry", {"type":"forensicPsychiatryDeclaration",
                                                    "siteShortName" : "retspsyk",
                                                    "properties" : properties}).then(function (response) {
                return response.data;

            });
        },

        getContents: function (node) {
            return $http.get("/alfresco/service/contents?node=" + node).then(function(response) {
                return response.data;
            });
        },

        getDropDownGroups: function() {
            return $http.get("/alfresco/service/conf?method=getDropDownColumnGroupNames").then(function(response) {
                console.log(response.data);
                return response.data;
            });
        }

    };
});
