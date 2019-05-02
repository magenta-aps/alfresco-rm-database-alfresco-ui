'use strict';

angular.module('openDeskApp.documents')
  .factory('documentService', documentService);

function documentService($http, EDITOR_CONFIG) {
  var service = {
    getDocument: getDocument,
    cleanupThumbnail: cleanupThumbnail,
    isLoolEditable: isLoolEditable,
    getState: getState,
  };

  return service;

  function getDocument(documentNodeRef) {
    return $http.get('/slingshot/doclib/node/workspace/SpacesStore/' + documentNodeRef)
      .then(function (response) {
        return response.data;
      });
  }

  function cleanupThumbnail(node) {
    var url = '/alfresco/s/previewhelper?version_node=' + node.split("/")[3] + '&method=cleanup';
    console.log('clean thumb')

    return $http.get(url)
      .then(function (response) {
        console.log(response)
        return response;
      });
  }

  function isLoolEditable(mimeType) {
    return EDITOR_CONFIG.lool.mimeTypes.indexOf(mimeType) !== -1;
  }

 function getState(nodeRef) {
        return $http.post("/alfresco/s/contents/markedforedit", {
          "nodeRef": nodeRef, "method" : "state"
        }).then(function (response) {
            return response.data.state;
        });
      }



}