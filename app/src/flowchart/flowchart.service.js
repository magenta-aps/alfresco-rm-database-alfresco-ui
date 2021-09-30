'use strict';

angular
  .module('oda.flowchart')
  .factory('FlowChartService', FlowChartService);

function FlowChartService($http) {

  var currentCase = {};

  var service = {
    setVisitatorData: setVisitatorData,
    get: getEntry,
    getEntries: getEntries,
    create: createEntry,
    unlock: unlockEntry,
    update: updateEntry,
    getAutoComleteEntries: getAutoComleteEntries,
    getAutoCompleteFlowChartEntries: getAutoCompleteFlowChartEntries,
    getWaitingList: getWaitingList,
    advancedSearch: advancedSearch,
    makeDeclarationDocument: makeDeclarationDocument
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


    function getEntries(entry, sort, desc) {
        return $http.post("/alfresco/s/database/retspsyk/flowchart", {
          "properties": {"method" : entry, "sort" : sort, "desc" : desc},
        }).then(function (response) {
          return response.data;
        });
    }

  function setVisitatorData(data, n) {
    return $http.post("/alfresco/s/database/retspsyk/flowchart", {

      "properties": {"method" : "visitator", "visitatorData" : data, "nodeRef" : n},

    }).then(function (response) {

      return response.data;

    });
  }

  function setFlag(flag, n) {
    return $http.post("/alfresco/s/database/retspsyk/flowchart", {

      "properties": {"method" : "redflag", "nodeRef" : n},

    }).then(function (response) {

      return response.data;

    });
  }

  function getEntry(caseNumber) {
    return $http.get("/alfresco/s/database/retspsyk/entry/" + caseNumber)
      .then(function (response) {
        return formatCase(response.data);
      });
  }


  function getAutoCompleteFlowChartEntries(skip, max, input) {
    if (input.includes("#")) {
      input = input.replace("#","!");
    }
    return $http.get("/alfresco/s/database/retspsyk/autocompleteentries" + "?skip=" + skip + "&maxItems=" + max + "&input=" + input + "&onlyflow=true")
        .then(function (response) {
          return response.data;
        });
  }

  function getAutoComleteEntries(skip, max, input) {

    if (input.includes("#")) {
      input = input.replace("#","!");
    }
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
      return formatCase(response.data);

    });
  }

  function makeDeclarationDocument(desclaration) {

    var d;
    if (desclaration.rulingDate == undefined) {
      d = new Date();

    }
    else {
      d = new Date(desclaration.rulingDate);

    }

    var dformattet = d.getDate() + "." + (d.getMonth() + 1) + "." + d.getFullYear();

    return $http.post("/alfresco/s/contents/mergedoctemplate", {
      "id": desclaration['node-uuid'],
      "type": desclaration.declarationType,
      "retten": desclaration.rulingCourt,
      "dato": dformattet
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
