'use strict';

angular
.module('openDeskApp.filebrowser')
.directive('odFilebrowser', function () {
    return {
        restrict: 'E',
        scope: {
            breadcrumb: '=odBreadcrumb'
        },
        templateUrl: 'app/src/filebrowser/view/filebrowser.html',
        controller: 'FilebrowserController',
        controllerAs: 'vm'
    };
});