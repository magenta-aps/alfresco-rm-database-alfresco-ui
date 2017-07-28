angular
    .module('openDeskApp')
    .factory('filterService', filterService);

function filterService($filter) {
    return {
        search: search,
        caseSearch: caseSearch,
        advancedCaseSearch: advancedCaseSearch,
        propertyFilter: propertyFilter
    };

    function search(array, query) {
        var hitList = $filter('filter')(array, query);
        return hitList;
    }

    function caseSearch(array, query, filters) {
        var hitList = $filter('casefilter')(array, query, filters);
        return hitList;
    }

    function advancedCaseSearch(array, filters) {
        var hitList = $filter('advancedcasefilter')(array, filters);
        return hitList;
    }

    function propertyFilter(array, query) {
        var hitList = $filter('propertyfilter')(array, query);
        return hitList;
    }
}