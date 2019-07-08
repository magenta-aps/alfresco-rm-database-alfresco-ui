'use strict';

angular
    .module('oda.content')
    .directive('contentAction', function () {
        return {
            restrict: 'E',
            scope: {
                content: '=',
                folderList: '='
            },
            controller: 'ContentActionController as vm',
            templateUrl: 'app/src/content/action/contentAction.html',
        };
    });