'use strict';

angular.module('openDeskApp.declaration').factory('cprService', function ($http) {

    var service = {
        getCPRData: getCPRData
    };

    return service;

    function getCPRData(cprNo) {
        return $http.get("/alfresco/s/cpr?cpr=" + cprNo).then(function (response) {
            return response.data;
        });
    }
});