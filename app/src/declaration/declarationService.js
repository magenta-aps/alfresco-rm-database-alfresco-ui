'use strict';

angular.module('openDeskApp.declaration').factory('declarationService', function ($http, $window, alfrescoNodeUtils) {

    var restBaseUrl = '/alfresco/s/api/';

    var _currentSiteType = "";

    return {


        setType: function (t){
            _currentSiteType = t;
        },
        getType: function() {

            console.log("flot")

            return _currentSiteType;
        },
        getCase : function(caseNumber) {
            return $http.get("/alfresco/s/entry?type=forensicPsychiatryDeclaration&entryKey=caseNumber&entryValue=" + caseNumber, {}).then(function (response) {
                return response.data;

            });
        },

        createCase : function() {
            return $http.post("/alfresco/s/entry", {"type":"forensicPsychiatryDeclaration",
                                                    "siteShortname" : "retspsyk"}, {"properties" : [{"test" : "test2"}]}).then(function (response) {
                console.log("response");
                console.log(response);
                return response.data;

            });

        }

    };
});
