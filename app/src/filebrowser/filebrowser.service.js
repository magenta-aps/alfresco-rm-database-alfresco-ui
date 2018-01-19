'use strict';

angular.module('openDeskApp.filebrowser')
    .factory('filebrowserService', fileBrowserService);

function fileBrowserService($http, $rootScope, alfrescoNodeUtils) {

    var currentFolderNodeRef;

    var service = {
        createFolder: createFolder,
        getCompanyHome: getCompanyHome,
        getContentList: getContentList,
        getCurrentFolderNodeRef: getCurrentFolderNodeRef,
        getNode: getNode,
        getTemplates: getTemplates,
        setCurrentFolder: setCurrentFolder,
        uploadFiles: uploadFiles
    };
    
    return service;

    function getCurrentFolderNodeRef() {
        return currentFolderNodeRef;
    }

    function setCurrentFolder(folderNodeRef) {
        currentFolderNodeRef = folderNodeRef;
    }

    function getCompanyHome() {
        return $http.get("/alfresco/service/contents/companyHome", {}).then(function (response) {
            return response.data.nodeRef;
        });
    }

    function getContentList(node) {
        return $http.get("/alfresco/service/contents?node=" + node).then(function (response) {
            return response.data;
        });
    }

    function getNode(nodeRef, path) {
        return $http.get('/slingshot/doclib/doclist/all/node/' + nodeRef + '/' + path).then(function (response) {
            return response.data;
        });
    }

    function createFolder(contentName, destination) {
        var props = {
            prop_cm_name: contentName,
            prop_cm_title: contentName,
            alf_destination: destination
        };

        return $http.post('/api/type/cm:folder/formprocessor', props).then(function (response) {
            $rootScope.$broadcast('updateFilebrowser');
            return response;
        });
    }

    function uploadFiles(file, destination) {
        // return $http.post("/alfresco/service/sites", {
        //     PARAM_METHOD: "returnFileName",
        //     PARAM_FILENAME: file.name,
        //     PARAM_DESTINATION: destination
        // }).then(function (response) {
            var formData = new FormData();
            formData.append("filedata", file);
            // formData.append("filename", response.data[0].fileName);
            formData.append("destination", destination ? destination : null);

            return $http.post("/api/upload", formData, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).then(function (response) {
                return response;
            });
        // });
    }

    function getTemplates(type) {
        return $http.post("/alfresco/service/template", {
            PARAM_METHOD: "get" + type + "Templates"
        }).then(function (response) {
            // var data = [];
            // if(type == "Document") {
            //     angular.forEach(response.data[0], function(template) {
            //         if(!template.isFolder) {
            //             data.push(template);
            //         } else {
            //             findNestedTemplates(template.nodeRef).then(function(nested) {
            //             });
            //         }
            //     });
            // }
            // console.log(data);
            return response.data[0];
        });
    }

    //not in use
    function findNestedTemplates(templateNodeRef) {
        var templatesObj = [];

        return getContentList(templateNodeRef).then(function(content)  {
            // console.log('welcome to recursion hell');
            // console.log(content);
            var templates = content[0];
            var folders = content[1];

            templatesObj.push(templates);

            // console.log(templates);
            angular.forEach(folders, function(folder) {
                // console.log(folder);
                var template = folder;
                findNestedTemplates(folder.shortRef);
            });

            return templatesObj;
        });
    }
}