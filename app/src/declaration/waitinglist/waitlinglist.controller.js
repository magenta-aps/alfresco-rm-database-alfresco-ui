'use strict';

angular
    .module('openDeskApp.declaration')
    .controller('WaitinglistController', WaitinglistController);

function WaitinglistController($state, entryService) {
    var vm = this;

    vm.waitingListCases = [];
    vm.gotoCase = gotoCase;
    vm.query = {
        order: '-waitingTime'
    };


    getWaitinglist();

    function gotoCase(caseNumber) {
        $state.go('declaration.show', {caseid: caseNumber});
    }

    function getWaitinglist() {
        entryService.getWaitingList(0,25).then(function (entries) {
            console.log('waiting list');

            angular.forEach(entries.entries, function (declaration) {

                    console.log("declaration");
                    console.log(declaration);
                    var date = new Date(declaration.creationDate);

                    var day = ('0' + date.getDate()).slice(-2);
                    var month = ('0' + (date.getMonth() + 1)).slice(-2);
                    var year = date.getFullYear();

                    declaration.creationDateFormatted = day + '/' + month + '/' + year;
                    var days = (new Date() - date) / 1000 / 60 / 60 / 24;

                    //declaration.waitingTime = days < 0.5 ? 0 : Math.ceil(days);
                    vm.waitingListCases.push(declaration);

            });
        }, function (err) {
            console.log(err);
        });
    }
}