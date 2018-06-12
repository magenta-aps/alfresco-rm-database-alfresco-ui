'use strict';

angular.module('openDeskApp.declaration').factory('entryService', function ($http) {

    var edit = false;
    var newCase = {};
    var currentCase = {};
    var caseTitle = '';
    var loading = true;

    var service = {
        toggleEdit: toggleEdit,
        isEditing: isEditing,
        setLoading: setLoading,
        isLoading: isLoading,
        setCurrentCaseAfterCreation: setCurrentCaseAfterCreation,
        getCurrentCase: getCurrentCase,
        updateNewCase: updateNewCase,
        getNewCaseInfo: getNewCaseInfo,
        getCaseTitle: getCaseTitle,
        getEntry: getEntry,
        getAutoComleteEntries: getAutoComleteEntries,
        getWaitingList: getWaitingList,
        advancedSearch: advancedSearch,
        updateEntry: updateEntry,
        createEntry: createEntry,
        unlockEntry: unlockEntry,
        getContents: getContents,
    };

    return service;

    function setCaseTitle(newCase) {
        caseTitle = newCase.firstName + ' ' + newCase.lastName + ' (' + newCase.caseNumber + ')';

        caseTitle += newCase.bua === "true" ? ' BUA' : '';
    }

    function formatCase(res) {
        angular.forEach(res, function (value, key) {
            if (value == 'null') {
                delete res[key];
            }
        });

        return res;
    }
    
    function toggleEdit(state) {
        edit = state;
    }

    function isEditing() {
        return edit;
    }

    function setLoading(state) {
        loading = state;
    }
    
    function isLoading() {
        return loading;
    }

    function setCurrentCaseAfterCreation(newCase) {
        currentCase = formatCase(newCase);
        setCaseTitle(currentCase);
    }

    function getCurrentCase() {
        return currentCase;
    }

    function updateNewCase(caseUpdate) {
        newCase = caseUpdate;
    }

    function getNewCaseInfo() {
        return newCase;
    }

    function getCaseTitle() {
        return caseTitle;
    }

    function getEntry(caseNumber) {
        return $http.get("/alfresco/s/database/retspsyk/entry/" + caseNumber)
        .then(function (response) {
            var res = response.data;
            setCaseTitle(res);
            currentCase = formatCase(res);
            return currentCase;
        });
    }

    function getAutoComleteEntries(skip, max, input) {
        return $http.get("/alfresco/s/database/retspsyk/autocompleteentries" + "?skip=" + skip + "&maxItems=" + max + "&input=" + input)
        .then(function (response) {
            return response.data;
        });
    }

    function advancedSearch(skip, max, query) {
        return $http.post(`/alfresco/s/database/retspsyk/page_entries?skip=${skip}&maxItems=${max}`,query)
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
            setCaseTitle(response.data);
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
            console.log(response.data);
            return response.data;

        });
    }

    function unlockEntry(properties) {
        return $http.put("/alfresco/s/entry/" + properties['node-uuid'] + '/unlock')
        .then(function (response) {
            return response.data;
        });
    }

    function getContents(node) {
        return $http.get("/alfresco/service/contents?node=" + node)
        .then(function (response) {
            return response.data;
        });
    }
});