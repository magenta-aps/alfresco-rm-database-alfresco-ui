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

    $scope.gotoWaitinglist = function() {
        $state.go('declaration.waitinglist');
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
            $scope.allCases = response;

            angular.forEach($scope.allCases, function(declaration) {
                if(!declaration.hasOwnProperty('closed')) {
                    var date = new Date(declaration.creationDate);

                    var day = ('0' + date.getDate()).slice(-2);
                    var month = ('0' + (date.getMonth() + 1)).slice(-2);
                    var year = date.getFullYear();

                    declaration.creationDateFormatted = day + '/' + month + '/' + year;
                    declaration.waitingTime = Math.ceil((new Date() - date) / 1000 / 60 / 60 / 24);
                    $scope.waitingListCases.push(declaration);
                }
            });
        });
    }

    getAllCases();
}