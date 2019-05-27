'use strict';

angular
  .module('openDeskApp.filebrowser')
  .directive('fileBrowser', function () {
    return {
      restrict: 'E',
      scope: {
        folderUuid: '=',
        hideActions: '=?',
        selectedContent: '=?',
        templateBrowser: '=?',
      },
      templateUrl: 'app/src/filebrowser/view/filebrowser.html',
      controller: 'FilebrowserController as vm'
    };
  });