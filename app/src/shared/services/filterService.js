angular
    .module('openDeskApp')
    .factory('filterService', filterService);

function filterService($filter) {
    return {
        search: search,
        caseSearch: caseSearch,
        advancedCaseSearch: advancedCaseSearch,
        dropdownFilter: dropdownFilter
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

    function dropdownFilter(array, query) {
        var hitList = $filter('dropdownfilter')(array, query);
        return hitList;
    }
}