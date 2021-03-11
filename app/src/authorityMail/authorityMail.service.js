'use strict';

angular.module('oda.authorityMail')
  .factory('authorityMail', authorityMail);

function authorityMail($http) {

  var service = {
    send: send,
    getDefaultMailBody : getDefaultMailBody,
      getPreview : getPreview
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

    return $http.post("/alfresco/s/contents/mailcontent", payload)
      .then(function (response) {
        return response;
      });
  }


    function getDefaultMailBody(decl) {
        return $http.get('/alfresco/s/settings?node=' + decl)
            .then(function (response) {

                return response.data;
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
