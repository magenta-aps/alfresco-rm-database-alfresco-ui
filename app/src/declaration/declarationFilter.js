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
    .filter('advancedcasefilter', advancedCaseFilter);

function advancedCaseFilter() {
    return function (cases, filters) {
        var filteredCases = [];

        var alreadyAdded = false;

        if (filters.hasOwnProperty('closed')) {
            filters['closed'] = 'closed';
        }

        angular.forEach(cases, function (declaration) {
            var filtersMet = [];
            var psychSet = false;
            var fromDateSet = false;
            var toDateSet = false;
            var waitTimeSet = false;
            angular.forEach(declaration, function (value, key) {

                angular.forEach(filters, function (fval, fkey) {
                    if (key == fkey && value == fval) {
                        filtersMet.push(true);
                    }

                    if (fkey == 'psychEval' && declaration.hasOwnProperty('psychologist') && !psychSet) {
                        filtersMet.push(true);
                        psychSet = true;
                    }

                    if (fkey == 'fromDate' && new Date(declaration.creationDate) >= fval && !fromDateSet) {
                        filtersMet.push(true);
                        fromDateSet = true;
                    }

                    if (fkey == 'toDate' && new Date(declaration.creationDate) <= fval && !toDateSet) {
                        console.log('to date is higher!');
                        filtersMet.push(true);
                        toDateSet = true;
                    }

                    if (fkey == 'waitingTime' && Object.keys(fval).length == 3 && !waitTimeSet) {
                        var waitTime = 0;
                        var creationDate = new Date(declaration.creationDate);
                        var observationDate = new Date(declaration.observationDate);
                        var declarationDate = new Date(declaration.declarationDate);

                        switch (fval.time) {
                            case 'passive':
                                waitTime = Math.ceil((observationDate - creationDate) / 1000 / 60 / 60 / 24);
                                break;
                            case 'active':
                                waitTime = Math.ceil((declarationDate - observationDate) / 1000 / 60 / 60 / 24);
                                break;
                            case 'total':
                                waitTime = Math.ceil((declarationDate - creationDate) / 1000 / 60 / 60 / 24);
                                break;
                        }

                        if (!isNaN(waitTime)) {
                            switch (fval.modifier) {
                                case 'over':
                                    if (waitTime > parseInt(fval.days)) {
                                        console.log(declaration);
                                        filtersMet.push(true);
                                        waitTimeSet = true;
                                    }
                                    break;
                                case 'under':
                                    if (waitTime < parseInt(fval.days)) {
                                        console.log(declaration);
                                        filtersMet.push(true);
                                        waitTimeSet = true;
                                    }
                                    break;
                                case 'equal':
                                    if (waitTime == parseInt(fval.days)) {
                                        console.log(declaration);
                                        filtersMet.push(true);
                                        waitTimeSet = true;
                                    }
                                    break;
                            }
                        }
                    }
                });
            });


            if (Object.keys(filters).length == filtersMet.length) {
                console.log(declaration);
                filteredCases.push(declaration);
            }

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

        angular.forEach(options, function (option) {
            if (option.toString().toLowerCase().indexOf(query.toLowerCase()) > -1) {
                this.push(option);
            }
        }, filteredOptions);
        return filteredOptions;
    };
}