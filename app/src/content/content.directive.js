'use strict';

angular
  .module('oda.content')
  .directive('contentList', function () {
    return {
      restrict: 'E',
      scope: {
        contentPath: '=',
        folderNodeRef: '='
      },
      templateUrl: 'app/src/content/contentList/contentList.html',
      controller: 'ContentListController'
    }
  })
  .directive('contentTemplate', function () {
    return {
      restrict: 'A',
      scope: {
        content: '='
      },
      templateUrl: 'app/src/content/contentList/contentTemplate.html'
    }
  })
  .directive('contentIcon', function () {
    return {
      scope: {
        content: '='
      },
      template: `<md-icon>
        {{content.nodeType == 'cm:folder' ? 'folder_open' : ''}}
        <img class="md-avatar" 
            ng-show="content.nodeType === 'cm:content'" 
            ng-src="app/assets/images/filetypes/{{content.thumbNailURL}}"
            onerror="this.src='app/assets/images/filetypes/generic-file-24.png'">
        </md-icon> `
    }
  })