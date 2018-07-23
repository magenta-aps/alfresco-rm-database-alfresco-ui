'use strict';

angular
    .module('openDeskApp')
    .directive('breadcrumb', breadcrumb);

function breadcrumb() {

    return {
        restrict: 'E',
        scope: {
            crumbs: "=",
            clickAction: '&'
        },
        templateUrl: 'app/src/shared/directives/breadcrumb/breadcrumb.html',
        controller: 'BreadcrumbController as vm'
    };
}
