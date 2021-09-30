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
    forceUnlock: forceUnlock,
    deleteTmpChartFile: deleteTmpChartFile
  };

  return service;

 function getThumbnail (nodeId, versionId) {
        return $http.get(`/alfresco/s/contents/thumbnail?nodeId=` + nodeId + "&versionId=" + versionId)
        .then(function (response) {
          return response
        })
}


  function deleteTmpChartFile(nodeRef) {
      $http.post("/alfresco/s/database/retspsyk/weeklystat", {
          "method": "deleteTmpChartFile",
          "tmpNodeRef": nodeRef
      }).then(function (response) {
      });
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
    //      var res = formatCase(response.data);
    //      return res;
    });
    }


    function forceUnlock(nodeRef) {
        return $http.post("/alfresco/s/contents/markedforedit", {
            "nodeRef": nodeRef, "method" : "forceUnlock"
        }).then(function (response) {
            //      var res = formatCase(response.data);
            //      return res;
        });
    }

    function getVersions (nodeId) {
    return $http.get(`/alfresco/service/contents/fetchversions?node=${nodeId}`)
      .then(function (response) {
        return response.data
      })
    }

    function revertToVersion (nodeRef, version) {
        return $http.post('alfresco/s/contents/revert', {
          nodeRef: nodeRef,
          version: version
        }).then(function (response) {
          return response
        })
      }



}
