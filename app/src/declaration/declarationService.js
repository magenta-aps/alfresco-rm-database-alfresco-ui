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

                console.log("what");
                console.log(response.data[0]);

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









                return response.data;
            });
        },
        
        getAllCases : function() {
            return $http.get("/alfresco/s/entry?type=forensicPsychiatryDeclaration", {}).then(function (response) {
                return response.data;
            });
        },

        updateCase : function(properties) {
            console.log(properties);
            return $http.put("/alfresco/s/entry?uuid=" + properties['node-uuid'],
                            {"properties" : properties}).then(function (response) {
                                console.log(response.data);

                return response.data;

            });
        },

        createCase : function(properties) {

            console.log("crap");
            console.log(properties);




            if (properties["placement"] != null) {
                properties["placement"] = JSON.stringify(properties["placement"]);
            }

            if (properties["ethnicity"] != null) {
                properties["ethnicity"] = JSON.stringify(properties["ethnicity"]);;
            }

            if (properties["fatherEthnicity"] != null) {
                properties["fatherEthnicity"] = JSON.stringify(properties["fatherEthnicity"]);
            }

            if (properties["motherEthnicity"] != null) {
                properties["motherEthnicity"] = JSON.stringify(properties["motherEthnicity"]);
            }

            if (properties["mainCharge"] != null) {
                properties["mainCharge"] = JSON.stringify(properties["mainCharge"]);
            }

            if (properties["referingAgency"] != null) {
                properties["referingAgency"] = JSON.stringify(properties["referingAgency"]);
            }

            if (properties["sanctionProposal"] != null) {
                properties["sanctionProposal"] = JSON.stringify(properties["sanctionProposal"]);
            }








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
                dropdownGroupOptions[groupName] = response.data.data;
            });
        },

        getDropdownOptions: function(groupName) {
            return dropdownGroupOptions[groupName];
        },

        getAllDropdownOptions: function() {
            console.log(dropdownGroupOptions);
            return dropdownGroupOptions;
        }

    };
});
