'use strict';

angular.module('openDeskApp.documents')
  .factory('documentService', documentService);

function documentService($http, EDITOR_CONFIG) {

  var selectedFiles = [];
  var caseFiles = [];

  var service = {
    setSelectedFiles: setSelectedFiles,
    getSelectedFiles: getSelectedFiles,
    resetSelectedFiles: resetSelectedFiles,
    setCaseFiles: setCaseFiles,
    getCaseFiles: getCaseFiles,
    getDocument: getDocument,
    cleanupThumbnail: cleanupThumbnail,
    isLoolEditable: isLoolEditable
  };

  return service;

  function setSelectedFiles(files) {
    selectedFiles = files;
  }

  function getSelectedFiles() {
    return selectedFiles;
  }

  function resetSelectedFiles() {
    selectedFiles = [];
  }

  function setCaseFiles(files) {
    caseFiles = files;
  }

  function getCaseFiles() {
    return caseFiles;
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
}