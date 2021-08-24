'use strict';

angular.module('openDeskApp.declaration').factory('practitionerService', function ($http) {
  var isCurrentlyEditing = false;
  var users = {};
  var usersBeforeEdit = {};

  var service = {
    getUserPermissions: getUserPermissions,
    updateUserRoles: updateUserRoles,
    updateUser: updateUser,
    getUserType: getUserType,
    getSignatureDest: getSignatureDest,
    updateUserSignature: updateUserSignature,
    isSignitureNodeCreated: isSignitureNodeCreated,
    getSignatureText: getSignatureText,
    // getSignatureImage: getSignatureImage,
    markUserAsHavingASignature: markUserAsHavingASignature
  };

  return service;


  function getUserPermissions(user, only_active) {
    return $http.get('/alfresco/s/userpermissions?user=' + user + "&onlyActivate=" + only_active)
      .then(function (response) {
        return response
      })
  }

  function getSignatureDest(username) {
    return $http.get('/alfresco/s/userSignature?userName=' +username + "&method=getTemplateLibrary").then(function (response) {
          return response;
    })
  }

  function updateUserSignature(val, username, signature) {
    return $http.get('/alfresco/s/updateUser?bua=' + val + "&userName=" +username + "&signature=" + encodeURI(signature) + "&method=update")
        .then(function (response) {
          return response
        })
  }

  function updateUser(val, username) {
    return $http.get('/alfresco/s/updateUser?bua=' + val + "&userName=" +username + "&method=update")
        .then(function (response) {
          return response
        })
  }

  function getUserType(username) {
    return $http.get('/alfresco/s/updateUser?userName=' +username + "&method=getUserType")
        .then(function (response) {
          return response
        })
  }

  function updateUserRoles(userName, addGroups, removeGroups) {
    var json = {
      addGroups: addGroups,
      removeGroups: removeGroups
    };

    if (addGroups[0] === 'active') {
      return activateUser(userName);
    }

    if (removeGroups[0] === 'active') {
      return deactivateUser(userName);
    }

    return $http.put('/alfresco/s/database/retspsyk/user/' + userName, json)
      .then(function (response) {
        return response.data;
      }, function (err) {
        console.log('error updating userroles for user:' + userName + ' and site: retspsyk');
      });
  }

  /** PRIVATE FUNCTIONS */

  function getPermissionGroups() {
    return $http.get('/alfresco/s/api/sites/retspsyk/roles')
      .then(function (response) {
        return response.data.permissionGroups;
      });
  }

  function activateUser(userName) {
    return $http.get('/alfresco/s/activateUser?userName=' + userName)
      .then(function (response) {
        return response
      })
  }

  function isSignitureNodeCreated(userName) {
    return $http.get('/alfresco/s/userSignature?userName=' + userName + "&method=exists")
        .then(function (response) {
          return response
        })
  }

  function markUserAsHavingASignature(userName) {
    return $http.get('/alfresco/s/userSignature?userName=' + userName + "&method=mark")
        .then(function (response) {
          return response
        })
  }

    function getSignatureText(userName) {
        return $http.get('/alfresco/s/userSignature?userName=' + userName + "&method=getSignatureText")
            .then(function (response) {
                return response
            })
    }

    function getSignatureImage(nodeRef) {
      alert("hej");
      console.log(nodeRef);
      return $http.get('/alfresco/s/api/node/workspace/SpacesStore/' + nodeRef + '/content');
    }

  function deactivateUser(userName) {
    return $http.get('/alfresco/s/deactivateUser?userName=' + userName + "&method")
      .then(function (response) {
        return response
      })
  }
});
