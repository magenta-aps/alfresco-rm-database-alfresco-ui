'use strict';

angular
    .module('openDeskApp')
    .filter('entryfilter', entryFilter);

function entryFilter() {
    return function (entries, query, facets) {
        var filteredEntries = [];

        var alreadyAdded = false;

        angular.forEach(entries, function (entry) {
            angular.forEach(entry, function (value, key) {
                if (facets.indexOf(key) > -1 && !alreadyAdded) {
                    if (value.toString().toLowerCase().indexOf(query.toLowerCase()) > -1) {
                        this.push(entry);
                        alreadyAdded = true;
                    }
                }
            }, filteredEntries);
            alreadyAdded = false;
        });
        return filteredEntries;
    };
}