angular
    .module('openDeskApp.declaration')
    .controller('DeclarationSearchController', DeclarationSearchController);

function DeclarationSearchController($scope, $state, $stateParams, declarationService, filterService) {

    $scope.caseid;
    $scope.showFilters = false;
    $scope.allCases;
    $scope.searchParams = {};
    $scope.selectedCase = null;

    $scope.$watch('selectedCase', function (newVal, oldVal) {
        if(newVal) {
            $scope.gotoCase($scope.selectedCase.caseNumber);
        }
    }, true);

    $scope.filterCases = function(query) {
        return filterService.caseSearch($scope.allCases, query);
    }

    $scope.search = function() {
        $state.go('declaration.show', {caseid: $scope.caseid});
    }

    $scope.gotoCase = function(caseNumber) {
        $state.go('declaration.show', {caseid: caseNumber});
    }
    

    $scope.toggleFilters = function() {
        $scope.showFilters = !$scope.showFilters;
    }

    $scope.advancedSearch = function() {
        console.log($scope.searchParams);
    }

    function getAllCases() {
        declarationService.getAllCases().then(function (response) {
            console.log('get all cases');
            console.log(response);
            $scope.allCases = response;
        });
    }

    getAllCases();
}