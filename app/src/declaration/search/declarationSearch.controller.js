'use strict';

angular
    .module('openDeskApp.declaration')
    .controller('DeclarationSearchController', DeclarationSearchController);

function DeclarationSearchController($scope, $state, $stateParams, $timeout, entryService, propertyService, filterService,loadingService) {

    var vm = this;

    vm.advancedSearchResults = [];
    $scope.caseid = null;
    $scope.showFilters = false;
    $scope.showResults = false;
    $scope.allCases = [];
    $scope.waitingListCases = [];
    $scope.searchParams = {};
    $scope.selectedCase = null;
    $scope.propertyValues = propertyService.getAllPropertyValues();

    $scope.query = {
        order: 'caseNumber'
    };

    $scope.filterCases = filterCases;
    $scope.propertyFilter = propertyFilter;
    $scope.search = search;
    vm.gotoCase = gotoCase;
    vm.gotoWaitinglist = gotoWaitinglist;
    vm.toggleFilters = toggleFilters;
    vm.toggleResults = toggleResults;
    vm.advancedSearch = advancedSearch;
    
    loadingService.setLoading(true);

    $timeout(function () {
        loadingService.setLoading(false);
    });

    $scope.$watch('selectedCase', function (newVal, oldVal) {
        if(newVal) {
            gotoCase($scope.selectedCase.caseNumber);
        }
    }, true);

    
    function filterCases(query, filters) {
        return filterService.entrySearch($scope.allCases, query, filters);
    }

    
    function propertyFilter(array, query) {
        return filterService.propertyFilter(array, query);
    }

    
    function search() {
        $state.go('declaration.show', {caseid: $scope.caseid});
    }

    
    function gotoCase(caseNumber) {
        $state.go('declaration.show', {caseid: caseNumber});
    }

    function gotoWaitinglist() {
        $state.go('declaration.waitinglist');
    }
    
    function toggleFilters() {
        $scope.showFilters = !$scope.showFilters;
        if($scope.showFilters) {
            $state.go('declaration.advancedSearch');
        }
        else {
            $state.go('declaration');
        }
    }
    
    function toggleResults() {
        $scope.results = !$scope.results;
    }
    
    function advancedSearch(params) {
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

        vm.advancedSearchResults = filterService.advancedEntrySearch($scope.allCases,filters);
    }

    function getAllEntries(input) {
        entryService.getAllEntries(0,25,input).then(function (response) {
            console.log('get all entries');
            $scope.allCases = response;
        }, function(err) {
            console.log(err);
        });
    }

    getAllEntries();
}