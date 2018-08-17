'use strict';

angular
  .module('openDeskApp.filebrowser')
  .directive('fileBrowser', function () {
    return {
      restrict: 'E',
      scope: {
        folderUuid: '=',
        hideActions: '=?',
        selectedContent: '=?'
      },
      templateUrl: 'app/src/filebrowser/view/filebrowser.html',
      controller: 'FilebrowserController as vm'
    };
  });