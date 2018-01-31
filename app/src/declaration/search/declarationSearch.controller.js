'use strict';

angular
    .module('openDeskApp.declaration')
    .controller('DeclarationSearchController', DeclarationSearchController);

function DeclarationSearchController($scope, $state, $timeout, entryService, loadingService) {

    var vm = this;

    $scope.selectedCase = null;
    vm.getEntries = getEntries;
    
    loadingService.setLoading(true);

    $timeout(function () {
        loadingService.setLoading(false);
    });

    $scope.$watch('selectedCase', function (newCase) {
        if(newCase) {
            $state.go('declaration.show', {caseid: newCase.caseNumber});
        }
    }, true);

    function getEntries(query) {
        return entryService.getAutoComleteEntries(0,5,query)
        .then(function(response) {
            console.log(response)
            return response.entries;
        })
    }
}