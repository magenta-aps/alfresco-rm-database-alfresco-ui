'use strict';

angular.module('openDeskApp.header').factory('HeaderService', HeaderService);

function HeaderService($rootScope, authService ) {

  var headerTitle = '';
  var caseId;
  var actions = [];
  var closed = false;
  var backtosearchquery;
  var backtosearchStatus = false;


  var service = {
    setTitle: setTitle,
    getTitle: getTitle,
    setCaseId: setCaseId,
    getCaseId: getCaseId,
    addAction: addAction,
    getActions: getActions,
    resetActions: resetActions,
    setClosed: setClosed,
    isClosed: isClosed,
    canAccessSettings: canAccessSettings,
    getUserName: getUserName,
    canUnlockCases: canUnlockCases,
    updateBacktosearch : updateBacktosearch,
    getBackToSearchStatus : getBackToSearchStatus,
    getBackToSearchQuery : getBackToSearchQuery,
    setBacktosearchStatus : setBacktosearchStatus

      };

  return service;

  function getTitle() {
    return headerTitle;
  }

  function setTitle(newTitle) {
    headerTitle = newTitle;
    $rootScope.$broadcast('updateHeader');
  }

  function updateBacktosearch(query) {
        console.log("update backtosearch")
        backtosearchquery = query;
        backtosearchStatus = true;
  }

 function setBacktosearchStatus(st) {
        backtosearchStatus = st;
        $rootScope.$broadcast('updateHeader');
 }



    function getBackToSearchQuery() {

        return backtosearchquery;
     }

 function getBackToSearchStatus() {

    return backtosearchStatus;
 }

  function getCaseId() {
    return caseId;
  }

  function setCaseId(newId) {
    caseId = newId;
    $rootScope.$broadcast('updateHeader');
  }

  function getActions() {
    return actions;
  }

  function resetActions() {
    actions = [];
    closed = false;
    $rootScope.$broadcast('updateHeader');
  }

  function addAction(label, icon, action, primary, settings) {
    actions.push({
      label: label,
      icon: icon,
      primary: primary,
      action: action,
      settings: settings
    })
    $rootScope.$broadcast('updateHeader');
  }

  function setClosed(val) {
    closed = val;
    $rootScope.$broadcast('updateHeader');
  }

  function isClosed() {
    return closed;
  }

  function getUserName() {
    var user = authService.getUserInfo().user;
    return user.firstName + ' ' + user.lastName;
  }

  function canAccessSettings() {
    var roles = authService.getUserRoles();
    if (!roles) return false;

    if (roles.indexOf('SiteManager') > -1 ||
      roles.indexOf('SiteRoleManager') > -1 ||
      roles.indexOf('SitePropertyValueManager') > -1 ||
      roles.indexOf('SiteRoleManager') > -1 ||
      roles.indexOf('TemplateFolderValueManager') > -1) {
      return true;
    }
    return false;
  }

  function canUnlockCases() {
    return authService.isAuthorized('SiteEntryLockManager');
  }
}