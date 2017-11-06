'use strict';

angular
.module('openDeskApp.filebrowser')
.directive('odFilebrowser', function () {
    return {
        restrict: 'E',
        scope: {
            breadcrumb: '=odBreadcrumb',
            createFolders: '=odFolders',
            preview: "=odPreview"
        },
        templateUrl: 'app/src/filebrowser/view/filebrowser.html',
        controller: 'FilebrowserController',
        controllerAs: 'vm'
    };
});