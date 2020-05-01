'use strict';

angular.module('openDeskApp.declaration').factory('practitionerService', function ($http) {
  var isCurrentlyEditing = false;
  var users = {};
  var usersBeforeEdit = {};

  var service = {
    getUserPermissions: getUserPermissions,
    updateUserRoles: updateUserRoles,
    updateUser: updateUser,
    getUserType: getUserType
  };

  return service;


  function getUserPermissions(user, only_active) {
    return $http.get('/alfresco/s/userpermissions?user=' + user + "&onlyActivate=" + only_active)
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

  function deactivateUser(userName) {
    return $http.get('/alfresco/s/deactivateUser?userName=' + userName)
      .then(function (response) {
        return response
      })
  }
});
