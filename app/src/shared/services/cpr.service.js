'use strict';

angular.module('openDeskApp.declaration')
  .factory('cprService', CprService);


function CprService($http, Toast) {

  var service = {
    getCPRData: getCPRData
  };

  return service;

  function getCPRData(cprNo) {
    return $http.get("/alfresco/s/cpr?cpr=" + cprNo)
      .then(function (response) {
        return response.data;
      })
      .error(function () {
        Toast.show('Ingen person med CPR nummeret ' + $scope.case.cprNumber)
      });
  }
}