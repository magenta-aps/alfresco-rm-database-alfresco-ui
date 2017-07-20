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

    return {
        toggleEdit: function() {
            edit = !edit;
        },

        isEditing: function() {
            return edit;
        },

        setCurrentCaseAfterCreation: function(newCase) {
            currentCase = newCase;
            setCaseTitle(currentCase);
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

                if (response.data[0].placement != null) {
                    response.data[0].placement = JSON.parse( response.data[0].placement );
                }

                if (response.data[0].ethnicity != null) {
                    response.data[0].ethnicity = JSON.parse( response.data[0].ethnicity );
                }

                if (response.data[0].fatherEthnicity != null) {
                    response.data[0].fatherEthnicity = JSON.parse( response.data[0].fatherEthnicity );
                }

                if (response.data[0].motherEthnicity != null) {
                    response.data[0].motherEthnicity = JSON.parse( response.data[0].motherEthnicity );
                }

                if (response.data[0].mainCharge != null) {
                    response.data[0].mainCharge = JSON.parse( response.data[0].mainCharge );
                }

                if (response.data[0].referingAgency != null) {
                    response.data[0].referingAgency = JSON.parse( response.data[0].referingAgency );
                }

                if (response.data[0].sanctionProposal != null) {
                    response.data[0].sanctionProposal = JSON.parse( response.data[0].sanctionProposal );
                }

                if (response.data[0].finalVerdict != null) {
                    response.data[0].finalVerdict = JSON.parse( response.data[0].finalVerdict );
                }

                if (response.data[0].status != null) {
                    response.data[0].status = JSON.parse( response.data[0].status );
                }

                if (response.data[0].diagnosis != null) {
                    response.data[0].diagnosis = JSON.parse( response.data[0].diagnosis );
                }

                if (response.data[0].bidiagnoses != null) {
                    response.data[0].bidiagnoses = JSON.parse( response.data[0].bidiagnoses );
                }

                if (response.data[0].reason != null) {
                    response.data[0].reason = JSON.parse( response.data[0].reason );
                }

                currentCase = response.data[0];
                return response.data[0];
            });
        },
        
        getAllCases : function() {
            return $http.get("/alfresco/s/entry?type=forensicPsychiatryDeclaration", {}).then(function (response) {
                return response.data;
            });
        },

        updateCase : function(properties) {
            return $http.put("/alfresco/s/entry?uuid=" + properties['node-uuid'],{"properties" : properties}).then(function (response) {
                return response.data;
            });
        },

        createCase : function(properties) {

            angular.forEach(properties, function(value, key) {
                if(value != null && typeof value == "object" && typeof value.getMonth != 'function') {
                    properties[key] = JSON.stringify(properties[key])
                }
            });

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

        getPropertyValues: function() {
            return $http.get("/alfresco/s/propertyValues").then(function(response) {
                dropdownGroupOptions = response.data;
                return response.data;
            });
        },

        getDropdownOptions: function(groupName) {
            return dropdownGroupOptions[groupName];
        },

        getAllDropdownOptions: function() {
            return dropdownGroupOptions;
        }

    };
});
