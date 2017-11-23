'use strict';

angular
.module('openDeskApp.filebrowser')
.directive('odActionMenu', function () {
    return {
        restrict: 'E',
        scrope: {},
        templateUrl: 'app/src/filebrowser/actions/actionMenu.html',
    };
});