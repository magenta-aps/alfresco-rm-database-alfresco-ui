'use strict';

angular.module('oda.authorityMail')
    .factory('authorityMail', authorityMail);

function authorityMail($http) {

  var service = {
    send: send
  };
  
  return service;

  function send (payload) {
    return $http.post("/alfresco/s/contents/mailcontent", payload)
    .then(function (response) {
        console.log(response);
    });
  }
}
