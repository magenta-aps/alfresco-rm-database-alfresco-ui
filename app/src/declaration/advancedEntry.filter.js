'use strict';

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
            var noDeclarationSet = false;
            
            angular.forEach(entry, function (value, key) {

                angular.forEach(filters, function (fval, fkey) {
                    if (key == fkey && value == fval) {
                        console.log(key + ' ' + value);
                        filtersMet.push(true);
                    }

                    if (fkey == 'givenDeclaration' && entry.hasOwnProperty('declarationDate') && !entry.hasOwnProperty('closedWithoutDeclaration') && !declarationDateSet) {
                        filtersMet.push(true);
                        declarationDateSet = true;
                    }

                    if(fkey == 'noDeclaration' && entry.hasOwnProperty('closedWithoutDeclaration') && entry.closedWithoutDeclaration && !noDeclarationSet) {
                        filtersMet.push(true);
                        noDeclarationSet = true;
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
        console.log(filteredEntries);
        return filteredEntries;
    };
}