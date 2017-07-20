angular
    .module('openDeskApp')
    .filter('casefilter', caseFilter);

function caseFilter() {
    return function (cases, query, facets) {
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

angular
    .module('openDeskApp')
    .filter('dropdownfilter', dropdownfilter);

function dropdownfilter() {
    return function (options, query) {

        var filteredOptions = [];

        var alreadyAdded = false;

        angular.forEach(options, function (option) {
            console.log(option);
            if(option.toString().toLowerCase().indexOf(query.toLowerCase()) > -1) {
                this.push(option);
            }
            // angular.forEach(option, function (value, key) {
                //console.log(value + ' ' + key);
                // if (facets.indexOf(key) > -1 && !alreadyAdded) {
                //     if (value.toString().toLowerCase().indexOf(query.toLowerCase()) > -1) {
                //         this.push(option);
                //         alreadyAdded = true;
                //     }
                // }
            // });
            alreadyAdded = false;
        },filteredOptions);
        return filteredOptions;
    };
}