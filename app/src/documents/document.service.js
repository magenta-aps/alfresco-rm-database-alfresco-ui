'use strict';

angular.module('openDeskApp.documents')
  .factory('documentService', documentService);

function documentService($http, EDITOR_CONFIG) {
  var service = {
    getDocument: getDocument,
    cleanupThumbnail: cleanupThumbnail,
    isLoolEditable: isLoolEditable,
    getState: getState,
    markDocumentAsEditing: markDocumentAsEditing,
    revertToVersion: revertToVersion,
    getThumbnail: getThumbnail,
    getVersions: getVersions,
  };

  return service;

 function getThumbnail (nodeId, versionId) {
        return $http.get(`/alfresco/s/contents/thumbnail?nodeId=` + nodeId + "&versionId=" + versionId)
        .then(function (response) {
          return response
        })
}

  function getDocument(documentNodeRef) {
    return $http.get('/slingshot/doclib/node/workspace/SpacesStore/' + documentNodeRef)
      .then(function (response) {
        return response.data;
      });
  }

  function cleanupThumbnail(node) {
    var url = '/alfresco/s/previewhelper?version_node=' + node.split("/")[3] + '&method=cleanup';

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
            return response.data;
        });
  }


 function markDocumentAsEditing(nodeRef) {
    return $http.post("/alfresco/s/contents/markedforedit", {
      "nodeRef": nodeRef, "method" : "add"
    }).then(function (response) {
        console.log(response)
    //      var res = formatCase(response.data);
    //      return res;
    });
    }

      function getVersions (nodeId) {
        return $http.get(`/alfresco/service/contents/getversions?node=${nodeId}`)
          .then(function (response) {
            return response.data
          })
      }

    function revertToVersion (description, majorVersion, nodeRef, version) {
        return $http.post('/api/revert', {
          description: description,
          majorVersion: majorVersion,
          nodeRef: nodeRef,
          version: version
        }).then(function (response) {
          return response
        })
      }



}