angular
    .module('openDeskApp')
    .filter('casefilter', caseFilter);

function caseFilter() {
    return function (cases, query, facets) {
        var items = {
            query: query,
            out: []
        };

        var filteredCases = [];

        var alreadyAdded = false;

        angular.forEach(cases, function (declaration) {
            angular.forEach(declaration, function (value, key) {
                if (facets.indexOf(key) > -1 && !alreadyAdded) {
                    if (value.toString().toLowerCase().indexOf(query.toLowerCase()) > -1) {
                        this.push(declaration);
                        alreadyAdded = true;
                    }

                }
            }, filteredCases);
            alreadyAdded = false;
        });
        return filteredCases;
    };
}