'use strict';

angular.module('oda.content')
  .factory('ContentService', ContentService);

function ContentService($http, $rootScope, $interval, alfrescoNodeUtils, fileUtilsService, alfrescoDownloadService, $state) {

  var currentFolderNodeRef;

  var service = {
    get: getContent,
    getContentList: getContentList,
    createFolder: createFolder,
    getNode: getNode,
    uploadFiles: uploadFiles,
    uploadTemplateFiles: uploadTemplateFiles,
    download: download,
    downloadZippedFiles: downloadZippedFiles,
    delete: deleteFile,
    move: moveFiles,
    getCurrentFolderNodeRef: getCurrentFolderNodeRef,
    setCurrentFolderNodeRef: setCurrentFolderNodeRef,
    getFolderNodeRefFromPath: getFolderNodeRefFromPath
  };

  return service;

  function getFolderNodeRefFromPath(path) {
    return getCompanyHome()
      .then(function (companyHomeUri) {
        return getNode(companyHomeUri, path)
          .then(function (response) {
            currentFolderNodeRef = response.metadata.parent.nodeRef;
            return alfrescoNodeUtils.processNodeRef(currentFolderNodeRef).id;
          });
      });
  }


  function getContent(path) {
    return getCompanyHome()
      .then(function (companyHomeUri) {
        return getNode(companyHomeUri, path)
          .then(function (response) {
            currentFolderNodeRef = response.metadata.parent.nodeRef;
            return getContentList(alfrescoNodeUtils.processNodeRef(currentFolderNodeRef).id)
              .then(function (response) {
                return response
              })
          });
      });
  }

  function getContentList(node) {
    return $http.get("/alfresco/service/contents?node=" + node)
      .then(function (response) {
        var lists = response.data
        angular.forEach(lists, function (list) {
          processContent(list);
        });
        return lists;
      });
  }

  function processContent(content) {
    angular.forEach(content, function (item) {
      item.thumbNailURL = fileUtilsService.getFileIconByMimetype(item.mimeType, 24);
    });
  }

  function getCurrentFolderNodeRef() {
    return currentFolderNodeRef;
  }

  function setCurrentFolderNodeRef(folderNodeRef) {
    currentFolderNodeRef = folderNodeRef;
  }

  function getNode(nodeRef, path) {
    return $http.get('/slingshot/doclib/doclist/all/node/' + nodeRef + '/' + path)
      .then(function (response) {
        return response.data;
      });
  }

  function createFolder(contentName, destination) {
    destination = destination ? destination : currentFolderNodeRef;
    var props = {
      prop_cm_name: contentName,
      prop_cm_title: contentName,
      alf_destination: destination
    };

    return $http.post('/api/type/cm:folder/formprocessor', props)
      .then(function (response) {
        $rootScope.$broadcast('updateFilebrowser');
        return response;
      });
  }

  function uploadFiles(file, destination) {
    destination = destination ? destination : currentFolderNodeRef;
    var formData = new FormData();
    formData.append("filedata", file);
    formData.append("destination", destination);

    return $http.post("/api/upload", formData, {
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
        }).then(function (response) {

            var props = { "nodeRef" : response.data.nodeRef};

              $http.post('/alfresco/s/contents/addpermission', props).then(function (response) {
                                    return response;
                                  });
        });
  }

   function uploadTemplateFiles(file, destination, templateType) {
      destination = destination ? destination : currentFolderNodeRef;
      var formData = new FormData();
      formData.append("filedata", file);
      formData.append("destination", destination);

      return $http.post("/api/upload", formData, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
          }).then(function (response) {

              var props = { "nodeRef" : response.data.nodeRef};
              var nodeRef = response.data.nodeRef;


                     var templProps = {"templateType" : templateType, "nodeRef" : nodeRef};

                    $http.post('/alfresco/s/contents/validatetemplatename', templProps).then(function (response) {
                                                            $state.reload()
                                                          return response;
                                                        });
              return response;
          });
    }

  function download(nodeRef, name) {
    alfrescoDownloadService.downloadFile(nodeRef, name);
  }

  function downloadZippedFiles(files) {
    var fileNodeRefs = [];

    files.forEach(function (file) {
      fileNodeRefs.push(file.nodeRef);
    });

    var payload = { nodeRefs: fileNodeRefs }

    return $http.post('/alfresco/s/contents/download', payload)
      .then(function (response) {
        var dl = $interval(function () {
          getDownloadStatus(response.data.downloadNodeRef)
            .then(function (status) {
              if (status == 'DONE') {
                download(response.data.downloadNodeRef, 'download.zip')
                $interval.cancel(dl);
              }
            });
        }, 1000, 20);
      });
  }

    function moveFiles(files) {
        var fileNodeRefs = [];

        files.forEach(function (file) {
          fileNodeRefs.push(file.nodeRef);
        });

        var payload = { nodeRefs: fileNodeRefs }

        return $http.post('/alfresco/s/contents/movecontent', payload)
          .then(function (response) {
            var dl = $interval(function () {
              getDownloadStatus(response.data.downloadNodeRef)
                .then(function (status) {
                  if (status == 'DONE') {
                    download(response.data.downloadNodeRef, 'download.zip')
                    $interval.cancel(dl);
                  }
                });
            }, 1000, 20);
          });
    }


  function deleteFile(nodeRef) {
    var url = '/slingshot/doclib/action/file/node/' + alfrescoNodeUtils.processNodeRef(nodeRef).uri;
    return $http.delete(url)
      .then(function (result) {
        $rootScope.$broadcast('updateFilebrowser');
        return result.data;
      });
  }



  /** PRIVATE FUNCTIONS */

  function getDownloadStatus(nodeRef) {
    return $http.get('/alfresco/s/contents/download/status?nodeRef=' + nodeRef)
      .then(function (result) {
        return result.data.downloadStatus;
      });
  }

  function getCompanyHome() {
    return $http.get("/alfresco/service/contents/companyHome")
      .then(function (response) {
        return alfrescoNodeUtils.processNodeRef(response.data.nodeRef).uri;
      });
  }
}
