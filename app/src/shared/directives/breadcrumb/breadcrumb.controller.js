'use strict';

angular
    .module('openDeskApp')
    .controller('BreadcrumbController', BreadcrumbController);

function BreadcrumbController($scope) {

    $scope.crumbs = buildCrumbs($scope.path)

    $scope.$watch('path', function (newVal) {
        $scope.crumbs = buildCrumbs(newVal)
    });

    $scope.go = function (content) {
        $scope.path = content.link
    };

    function buildCrumbs(path) {
        if (path === undefined) return;
        var crumbs = [];
        var pathArray = path.split('/');
        pathArray = pathArray.filter(function (n) { return n != '' });

        angular.forEach(pathArray, function (title, key) {
            var link = ''
            var i = 0;
            while (i <= key) {
                link += '/' + pathArray[i]
                i++
            }

            crumbs.push({ title: title, link: link })
        });

        return crumbs;
    }
}