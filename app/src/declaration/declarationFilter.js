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

angular
    .module('openDeskApp')
    .filter('advancedentryfilter', advancedEntryFilter);

function advancedEntryFilter() {
    return function (entries, filters) {
        var filteredEntries = [];

        var alreadyAdded = false;

        angular.forEach(entries, function (entry) {
            var filtersMet = [];
            var psychSet = false;
            var socialSet = false;
            var fromDateSet = false;
            var toDateSet = false;
            var waitTimeSet = false;
            var declarationDateSet = false;
            angular.forEach(entry, function (value, key) {

                angular.forEach(filters, function (fval, fkey) {
                    if (key == fkey && value == fval) {
                        filtersMet.push(true);
                    }

                    if (fkey == 'closed' && entry.hasOwnProperty('declarationDate') && !declarationDateSet) {
                        filtersMet.push(true);
                        declarationDateSet = true;
                    }

                    if (fkey == 'psychEval' && entry.hasOwnProperty('psychologist') && !psychSet) {
                        filtersMet.push(true);
                        psychSet = true;
                    }

                    if (fkey == 'socialEval' && entry.hasOwnProperty('socialworker') && !socialSet) {
                        filtersMet.push(true);
                        socialSet = true;
                    }

                    if (fkey == 'fromDate' && new Date(entry.creationDate) >= fval && !fromDateSet) {
                        filtersMet.push(true);
                        fromDateSet = true;
                    }

                    if (fkey == 'toDate' && new Date(entry.creationDate) <= fval && !toDateSet) {
                        filtersMet.push(true);
                        toDateSet = true;
                    }

                    if (fkey == 'waitingTime' && Object.keys(fval).length == 3 && !waitTimeSet) {
                        var waitTime = 0;
                        var creationDate = new Date(entry.creationDate);
                        var observationDate = new Date(entry.observationDate);
                        var declarationDate = new Date(entry.declarationDate);

                        switch (fval.time) {
                            case 'passive':
                                waitTime = Math.ceil((observationDate - creationDate) / 1000 / 60 / 60 / 24);
                                entry.passiveWaitTime = waitTime;
                                break;
                            case 'active':
                                waitTime = Math.ceil((declarationDate - observationDate) / 1000 / 60 / 60 / 24);
                                entry.activeWaitTime = waitTime;
                                break;
                            case 'total':
                                waitTime = Math.ceil((declarationDate - creationDate) / 1000 / 60 / 60 / 24);
                                entry.totalWaitTime = waitTime;
                                break;
                        }

                        if (!isNaN(waitTime)) {
                            switch (fval.modifier) {
                                case 'over':
                                    if (waitTime > parseInt(fval.days)) {
                                        filtersMet.push(true);
                                        waitTimeSet = true;
                                    }
                                    break;
                                case 'under':
                                    if (waitTime < parseInt(fval.days)) {
                                        filtersMet.push(true);
                                        waitTimeSet = true;
                                    }
                                    break;
                                case 'equal':
                                    if (waitTime == parseInt(fval.days)) {
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
                filteredEntries.push(entry);
            }

            alreadyAdded = false;
        });
        return filteredEntries;
    };
}

angular
    .module('openDeskApp')
    .filter('propertyfilter', propertyfilter);

function propertyfilter() {
    return function (options, query) {

        var filteredProperties = [];

        angular.forEach(options, function (option) {
            if (option.toString().toLowerCase().indexOf(query.toLowerCase()) > -1) {
                this.push(option);
            }
        }, filteredProperties);
        return filteredProperties;
    };
}