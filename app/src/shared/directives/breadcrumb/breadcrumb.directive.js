'use strict';

angular
    .module('openDeskApp')
    .directive('breadcrumb', breadcrumb);

function breadcrumb() {

    return {
        restrict: 'E',
        scope: {
            path: "="
        },
        templateUrl: 'app/src/shared/directives/breadcrumb/breadcrumb.html',
        controller: 'BreadcrumbController'
    };
}
