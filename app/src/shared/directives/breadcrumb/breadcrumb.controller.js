'use strict';

angular
    .module('openDeskApp')
    .controller('BreadcrumbController', BreadcrumbController);

function BreadcrumbController($scope) {

    $scope.go = function (content) {
        $scope.clickAction()(content)
    };
}