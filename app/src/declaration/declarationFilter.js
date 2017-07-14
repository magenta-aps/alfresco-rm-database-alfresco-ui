angular
    .module('openDeskApp')
    .filter('casefilter', caseFilter);

function caseFilter() {
    return function (cases, query) {
        var items = {
            query: query,
            out: []
        };

        var filteredCases = [];

        var facets = ['cprNumber', 'caseNumber', 'fullName'];

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