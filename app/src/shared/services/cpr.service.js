'use strict';

angular.module('openDeskApp.declaration').factory('cprService', function ($http) {

    var service = {
        getCPRData: getCPRData,
    };

    return service;

    function getCPRData(cprNo) {
        return $http.get("/app/src/declaration/testdata.json").then(function (response) {
            return response.data;
        });
    }
});