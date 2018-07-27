'use strict';

angular
  .module('openDeskApp.declaration')
  .factory('DeclarationService', DeclarationService);

function DeclarationService($http) {

  var currentCase = {};

  var service = {
    get: getEntry,
    create: createEntry,
    unlock: unlockEntry,
    update: updateEntry,
    getAutoComleteEntries: getAutoComleteEntries,
    getWaitingList: getWaitingList,
    advancedSearch: advancedSearch
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

  function getEntry(caseNumber) {
    return $http.get("/alfresco/s/database/retspsyk/entry/" + caseNumber)
      .then(function (response) {
        return formatCase(response.data);
      });
  }

  function getAutoComleteEntries(skip, max, input) {
    return $http.get("/alfresco/s/database/retspsyk/autocompleteentries" + "?skip=" + skip + "&maxItems=" + max + "&input=" + input)
      .then(function (response) {
        return response.data;
      });
  }

  function advancedSearch(skip, max, query) {
    return $http.post(`/alfresco/s/database/retspsyk/page_entries?skip=${skip}&maxItems=${max}`, query)
      .then(response => {
        return response.data;
      });
  }

  function getWaitingList(skip, max) {
    return $http.get(`/alfresco/s/database/retspsyk/waitinglist?skip=${skip}&maxItems=${max}`)
      .then(function (response) {
        return response.data;
      });
  }

  function updateEntry(properties) {
    return $http.put("/alfresco/s/entry/" + properties['node-uuid'], {
      "properties": properties
    }).then(function (response) {
      var res = formatCase(response.data);
      return res;
    });
  }

  function createEntry(entry) {
    return $http.post("/alfresco/s/database/retspsyk/entry", {
      "type": "forensicPsychiatryDeclaration",
      "properties": entry.properties,
      "bua": entry.bua
    }).then(function (response) {
      return response.data;

    });
  }

  function unlockEntry(properties) {
    return $http.put("/alfresco/s/entry/" + properties['node-uuid'] + '/unlock')
      .then(function (response) {
        return response.data;
      });
  }
}