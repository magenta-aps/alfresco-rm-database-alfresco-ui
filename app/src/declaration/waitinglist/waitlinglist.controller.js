'use strict';

angular
    .module('openDeskApp.declaration')
    .controller('WaitinglistController', WaitinglistController);

function WaitinglistController($state, entryService) {
    var vm = this;

    vm.waitingListCases = [];
    vm.totalCases = 0;
    vm.isLoading = false;
    vm.gotoCase = gotoCase;
    vm.query = {
        order: '-waitingTime',
        limit: 5,
        page: 1
    };
    var next = 0;
    vm.nextPage = nextPage;


    getWaitinglist(0,1000);

    function gotoCase(caseNumber) {
        $state.go('declaration.show', {caseid: caseNumber});
    }

    function nextPage() {
        getWaitinglist(next,1000)
    }

    function getWaitinglist(skip,max) {
        vm.isLoading = true;
        entryService.getWaitingList(skip,max)
        .then(entries => {
            vm.isLoading = false;
            vm.totalCases = entries.total;
            next = entries.next;

            angular.forEach(entries.entries, function (declaration) {
                    var date = new Date(declaration.creationDate);

                    var day = ('0' + date.getDate()).slice(-2);
                    var month = ('0' + (date.getMonth() + 1)).slice(-2);
                    var year = date.getFullYear();
                    declaration.creationDateFormatted = day + '/' + month + '/' + year;

                    vm.waitingListCases.push(declaration);

            });
        }, function (err) {
            console.log(err);
        });
    }
}