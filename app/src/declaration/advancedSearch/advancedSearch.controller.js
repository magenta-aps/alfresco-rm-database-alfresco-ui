'use strict';

angular
    .module('openDeskApp.declaration')
    .controller('AdvancedSearchController', AdvancedSearchController);

function AdvancedSearchController($scope, $state, $timeout, entryService, filterService, propertyService, loadingService) {

    var vm = this;

    $scope.searchParams = {}

    vm.searchResults = [];
    vm.totalResults = 0;
    vm.next = 0;
    vm.isLoading = false;
    $scope.showResults = false;
    vm.gotoCase = gotoCase;
    $scope.propertyValues = propertyService.getAllPropertyValues();
    $scope.propertyFilter = propertyFilter;
    vm.toggleResults = toggleResults;
    vm.advancedSearch = advancedSearch;
    vm.nextPage = nextPage;
    vm.clearResults = clearResults;
    
    loadingService.setLoading(true);

    $timeout(function () {
        loadingService.setLoading(false);
    });

    function gotoCase(caseNumber) {
        $state.go('declaration.show', {caseid: caseNumber});
    }

    function propertyFilter(array, query) {
      return filterService.propertyFilter(array, query);
    }

    
    function toggleResults() {
        $scope.showResults = !$scope.showResults;
    }

    function clearResults () {
      vm.searchResults = [];
    }
    
    function advancedSearch(skip, max, query) {
      clean(query);
      vm.isLoading = true;
      entryService.advancedSearch(skip, max, query)
      .then(response => {
        // vm.searchResults = response;
        vm.isLoading = false;
        vm.totalResults = Number(response.total);
        vm.next = Number(response.next);

        angular.forEach(response.entries, entry => {
          vm.searchResults.push(entry);

  });
      })
    }

    function nextPage() {
      advancedSearch(vm.next, 25, $scope.searchParams)
    }

    function clean(obj) {
      for (var propName in obj) { 
        if (obj[propName] === null || obj[propName] === undefined || obj[propName] === "" || obj[propName] === false) {
          delete obj[propName];
        }
      }
    }
}