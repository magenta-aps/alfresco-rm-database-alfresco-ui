'use strict';

angular
  .module('openDeskApp.declaration')
  .factory('DeclarationPsycService', DeclarationPsycService);

function DeclarationPsycService($http, $filter) {

  var currentCase = {};

  var service = {
    test2 : test2,
    getInstruments : getInstruments
  };

  return service;

  function formatCase(res) {
    angular.forEach(res, function (value, key) {
      if (value == 'null') {
        delete res[key];
      }
    });

    return res;
  }

  function test2() {
    console.log("hej morakker");

    return $http.post("/alfresco/s/database/retspsyk/psyc", {

      "properties": {"method" : "test", "gaf" : "kat"}

    }).then(function (response) {

      console.log("response");
      console.log(response.data);

      return response.data;
    });
  }

  function getInstruments(caseNumber) {
    return $http.post("/alfresco/s/database/retspsyk/psyc", {
      "properties" : {"method" : "getInstruments", "caseid" : caseNumber}
    }).then(function (response) {
        return response.data;
      });
  }
}
