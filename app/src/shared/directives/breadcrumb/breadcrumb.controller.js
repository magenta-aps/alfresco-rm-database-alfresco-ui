'use strict';

angular
    .module('openDeskApp')
    .controller('BreadcrumbController', BreadcrumbController);

function BreadcrumbController($scope) {

    $scope.$watch('bcPath', function(newVal) {
        if($scope.bcPath.length >= 2) {
            $scope.bcPath.splice(1, 1);
        }
    });

}