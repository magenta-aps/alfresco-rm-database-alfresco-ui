'use strict';

angular.module('openDeskApp')
.factory('breadcrumbService', function ($http) {

    var path = [];

    var service = {
        getPath: getPath,
        setPath: setPath
    };

    return service;

    function getPath() {
        return path;
    }

    function setPath(response) {
        path = [{
            title: response.item.location.siteTitle,
            link: 'project.filebrowser({projekt: "' + response.item.location.site.name + '", path: ""})'
        }];
        var pathArr = response.item.location.path.split('/');
        var pathLink = '/';
        for (var a in pathArr) {
            if (pathArr[a] !== '') {
                var link;
                if (response.item.location.site === "") {
                    link = 'administration.document_templates({path: "' + pathLink + pathArr[a] + '"})';
                } else {
                    link = 'project.filebrowser({projekt: "' + response.item.location.site.name +
                        '", path: "' + pathLink + pathArr[a] + '"})';
                }
                path.push({
                    title: pathArr[a],
                    link: link
                });
                pathLink = pathLink + pathArr[a] + '/';
            }
        }
        path.push({
            title: response.item.location.file,
            link: response.item.location.path
        });
    }

});