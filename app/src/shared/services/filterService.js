angular
    .module('openDeskApp')
    .factory('filterService', filterService);

function filterService($filter) {
    return {
        search: search,
        entrySearch: entrySearch,
        advancedEntrySearch: advancedEntrySearch,
        propertyFilter: propertyFilter
    };

    function search(array, query) {
        var hitList = $filter('filter')(array, query);
        return hitList;
    }

    function entrySearch(array, query, filters) {
        var hitList = $filter('entryfilter')(array, query, filters);
        return hitList;
    }

    function advancedEaseSearch(array, filters) {
        var hitList = $filter('advancedentryfilter')(array, filters);
        return hitList;
    }

    function propertyFilter(array, query) {
        var hitList = $filter('propertyfilter')(array, query);
        return hitList;
    }
}