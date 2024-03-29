angular
    .module('openDeskApp')
    .factory('alfrescoDownloadService', AlfrescoDownloadService);

function AlfrescoDownloadService(alfrescoNodeUtils, ALFRESCO_URI, sessionService) {

    var service = {
        downloadFile: downloadFile
    };
    return service;

    function downloadFile(nodeRef, fileName) {

        var url = ALFRESCO_URI.webClientServiceProxy + "/api/node/content/" + alfrescoNodeUtils.processNodeRef(nodeRef).uri + "/" + fileName + "?a=true";
        url = sessionService.makeURL(url);


        var iframe = document.querySelector("#downloadFrame");
        if (iframe === null) {
            iframe = angular.element("<iframe id='downloadFrame' style='position:fixed;display:none;top:-1px;left:-1px;'/>");
            angular.element(document.body).append(iframe);
        } else {
            iframe = angular.element(iframe);
        }

        iframe.attr("src", url);
    }
}
