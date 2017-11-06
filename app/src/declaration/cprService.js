'use strict';

angular.module('openDeskApp.declaration').factory('cprService', function ($http) {

    return {
        getCPRData: function (cprNo) {
            return $http.get("/app/src/declaration/testdata.json").then(function (response) {
                return response.data;
            });
        },
    };
});