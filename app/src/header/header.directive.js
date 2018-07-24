'use strict';

angular
    .module('openDeskApp.header')
    .directive('odaHeader', function () {
        return {
            restrict: 'E',
            scope: {},
            templateUrl: 'app/src/header/header.view.html',
            controller: 'HeaderController',
            controllerAs: 'vm'
        };
    });