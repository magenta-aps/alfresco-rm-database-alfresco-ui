'use strict';

angular.module('openDeskApp.declaration').factory('declarationService', function ($http, $window, alfrescoNodeUtils) {

    var edit = false;
    var newCase = {};
    var currentCase = {};
    var caseTitle = '';
    var dropdownGroupNames = {};
    var dropdownGroupOptions = {};

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
            // currentCase.creationDate = moment(newCase.creationDate);
            // console.log(moment(newCase.creationDate).format('YYYY-MM-DD'));
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
                return response.data;
            });
        },

        updateCase : function(caseNumber, properties) {
            console.log(properties);
            return $http.put("/alfresco/s/entry?type=forensicPsychiatryDeclaration&entryKey=caseNumber&entryValue=" + caseNumber,
                            {"type":"forensicPsychiatryDeclaration",
                            "siteShortName" : "retspsyk",
                            "properties" : properties}).then(function (response) {
                                console.log(response.data);

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

        getDropdownGroups: function() {
            return $http.get("/alfresco/service/conf?method=getDropDownColumnGroupNames").then(function(response) {
                dropdownGroupNames = response.data;
                return response.data;
            });
        },

        setDropdownOptions: function(groupName) {
            $http.get("alfresco/s/api/groups/GROUP_"+ groupName +"/children?authorityType=GROUP").then(function(response) {
                //dropdownGroupOptions = response.data;
                // console.log(response.data.data);
                dropdownGroupOptions[groupName] = response.data.data;
                // console.log('retrieved ' + groupName);
                // console.log(dropdownGroupOptions);
            });
        },

        getDropdownOptions: function(groupName) {
            // console.log('dropdown options for ' + groupName);
            return dropdownGroupOptions[groupName];
        },

        getAllDropdownOptions: function() {
            return dropdownGroupOptions;
        }

    };
});
