angular
    .module('openDeskApp.declaration')
    .controller('DeclarationSearchController', DeclarationSearchController);

function DeclarationSearchController($scope, $state, $stateParams, entryService, propertyService, filterService) {

    $scope.caseid;
    $scope.showFilters = false;
    $scope.showResults = false;
    $scope.allCases;
    $scope.waitingListCases = [];
    $scope.searchParams = {};
    $scope.selectedCase = null;
    $scope.propertyValues = propertyService.getAllPropertyValues();

    $scope.query = {
        order: 'caseNumber'
    }

    $scope.$watch('selectedCase', function (newVal, oldVal) {
        if(newVal) {
            $scope.gotoCase($scope.selectedCase.caseNumber);
        }
    }, true);

    $scope.filterCases = function(query, filters) {
        return filterService.entrySearch($scope.allCases, query, filters);
    }

    $scope.propertyFilter = function(array, query) {
        return filterService.propertyFilter(array, query);
    }

    $scope.search = function() {
        $state.go('declaration.show', {caseid: $scope.caseid});
    }

    $scope.gotoCase = function(caseNumber) {
        $state.go('declaration.show', {caseid: caseNumber});
    }

    $scope.gotoWaitinglist = function() {
        $state.go('declaration.waitinglist');
    }
    

    $scope.toggleFilters = function() {
        $scope.showFilters = !$scope.showFilters;
        if($scope.showFilters) {
            $state.go('declaration.advancedSearch');
        }
        else {
            $state.go('declaration');
        }
    }

    $scope.toggleResults = function() {
        $scope.results = !$scope.results;
    }

    $scope.advancedSearch = function(params) {
        for (var filter in params) { 
            if (params[filter] == null || params[filter] == "") {
                delete params[filter];
            }

            if(filter == 'waitingTime') {
                angular.forEach(params[filter], function(value,key) {
                    if(value == "") {
                        delete params[filter];
                    }
                });
            }
        }
        var filters = angular.copy(params);
        console.log(filters);
        $scope.advancedSearchResults = filterService.advancedEntrySearch($scope.allCases,filters);
    }

    function getAllEntries() {
        entryService.getAllEntries().then(function (response) {
            console.log('get all entries');
            $scope.allCases = response;

            angular.forEach($scope.allCases, function(declaration) {
                if(!declaration.hasOwnProperty('closed')) {
                    var date = new Date(declaration.creationDate);

                    var day = ('0' + date.getDate()).slice(-2);
                    var month = ('0' + (date.getMonth() + 1)).slice(-2);
                    var year = date.getFullYear();

                    declaration.creationDateFormatted = day + '/' + month + '/' + year;
                    var days = (new Date() - date) / 1000 / 60 / 60 / 24;

                    

                    declaration.waitingTime = days < 0.5 ? 0 : Math.ceil(days);
                    $scope.waitingListCases.push(declaration);
                }
            });
        });
    }

    getAllEntries();
}