angular
    .module('openDeskApp')
    .factory('filterService', filterService);

function filterService($filter) {
    return {
        search: search,
        caseSearch: caseSearch
    };

    function search(array, query) {
        var hitList = $filter('filter')(array, query);
        return hitList;
    }

    function caseSearch(array, query) {
        var hitList = $filter('casefilter')(array, query);
        return hitList;
    }
}