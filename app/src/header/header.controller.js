'use strict';

angular
    .module('openDeskApp')
    .controller('HeaderController', HeaderController);

function HeaderController($scope, $state, headerService) {

    var vm = this;

    vm.leftHeaderTitle = 'test';
    
    $scope.$on('updateLeftHeaderTitle', function() {
        updateLeftHeaderTitle();
    });   

    function updateLeftHeaderTitle() {
        vm.leftHeaderTitle = headerService.getLeftHeaderTitle();
    }
}

    