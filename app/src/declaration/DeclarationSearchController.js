angular
    .module('openDeskApp.declaration')
    .controller('DeclarationSearchController', DeclarationSearchController);

function DeclarationSearchController($scope, $state, $stateParams, declarationService, filterService) {

    $scope.caseid;
    $scope.showFilters = false;
    $scope.allCases;
    $scope.waitingListCases = [];
    $scope.searchParams = {};
    $scope.selectedCase = null;
    $scope.dropdownOptions = declarationService.getAllDropdownOptions();

    $scope.$watch('selectedCase', function (newVal, oldVal) {
        if(newVal) {
            $scope.gotoCase($scope.selectedCase.caseNumber);
        }
    }, true);

    $scope.filterCases = function(query, filters) {
        return filterService.caseSearch($scope.allCases, query, filters);
    }

    $scope.dropdownFilter = function(array, query, filters) {
        return filterService.caseSearch(array, query, filters);
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

            angular.forEach($scope.allCases, function(declaration) {
                console.log(declaration);
                if(!declaration.hasOwnProperty('closed')) {
                    $scope.waitingListCases.push(declaration);
                }
            });

            console.log($scope.waitingListCases);
        });
    }

    getAllCases();
}