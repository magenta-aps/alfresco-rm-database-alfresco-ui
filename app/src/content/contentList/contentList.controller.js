'use strict';

angular
  .module('oda.content')
  .controller('ContentListController', ContentListController);

function ContentListController($scope, $state, ContentService, alfrescoNodeUtils) {
  $scope.contentList = [];
  $scope.isLoading = false;

  $scope.$on('updateFilebrowser', function () {
    activate();
  });

  $scope.$watch('contentPath', function () {
    activate();
  });

  activate();

  function activate() {
    $scope.isLoading = true;
    ContentService.get($scope.contentPath)
      .then(function (response) {
        $scope.isLoading = false;
        $scope.contentList = response;
      })
  }

  $scope.hasContent = function () {
    return $scope.contentList.length > 0 ? true : false;
  }

  $scope.open = function (content) {
    switch (content.nodeType) {
      case 'cm:folder':
        $scope.contentPath = content.location.path + '/' + content.location.file;
        break;
      case 'cm:content':
        console.log('load the content here')
        var shortRef = alfrescoNodeUtils.processNodeRef(content.nodeRef).id;
        console.log(shortRef)
        $state.go('document', { doc: shortRef });
        break;
      default:
        console.log(content.nodeType + ' is not supported')
    }
  };
}
