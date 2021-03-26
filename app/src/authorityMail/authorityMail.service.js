'use strict';

angular.module('oda.authorityMail')
  .factory('authorityMail', authorityMail);

function authorityMail($http) {

  var service = {
    send: send,
    getDefaultMailBody : getDefaultMailBody,
    getPreview : getPreview,
    areSignituresAvailable : areSignituresAvailable
  };

  return service;

  function send(payload) {

    var email = payload.authority.match(/ *\([^)]*\) */g);

    if (email != null) {

        email = email[0];
        email = email.replace("(","");
        email = email.replace(")","");
        email = email.trim();

        payload.authority = email;
    }
      payload.method = "send";

    return $http.post("/alfresco/s/contents/mailcontent", payload)
      .then(function (response) {
          console.log("sent");
        return response;
      });
  }


    function getDefaultMailBody(decl) {
        return $http.get('/alfresco/s/settings?node=' + decl)
            .then(function (response) {

                return response.data;
            });
    }

    function areSignituresAvailable(caseId) {

        var properties = {"caseid" : caseId, "method" : "signitureAvailability"}
        return $http.post("/alfresco/s/contents/mailcontent", properties)
            .then(function (response) {
                return response;
            });

    }

     function getPreview(payload) {
        payload.method = "preview";
        return $http.post("/alfresco/s/contents/mailcontent", payload)
         .then(function (response) {
             return response;
         });
     }
}
