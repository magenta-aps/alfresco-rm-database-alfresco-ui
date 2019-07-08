'use strict';

angular
  .module('openDeskApp.filebrowser')
  .controller('FilebrowserController', FilebrowserController);

function FilebrowserController($stateParams, $scope, $rootScope, $state, ContentService, alfrescoNodeUtils) {

  var strPath = $stateParams.path;

  $scope.folderUuid = ''; //from directive definition
  $scope.crumbs = [];
  $scope.content = [];
  $scope.selectedContent = [];
  $scope.isLoading = false;
  $scope.templateBrowser = !strPath.includes("Template")
  $scope.standardBrowser = (strPath.includes("Template"))



  $scope.$watch('folderUuid', function (newVal) {
    if (newVal) getContent(newVal);
  })

  $scope.$watch('content', function (contentList) {
    var selectedContent = [];
    angular.forEach(contentList, function (content) {
      angular.forEach(content, function (c) {
        if (c.selected) {
          selectedContent.push(c);
        }
      })
    })
    $scope.selectedContent = selectedContent;
  }, true);

  $rootScope.$on('updateFilebrowser', function () {
    getContent($scope.folderUuid);
  })

  function getContent(folderUuid) {
    $scope.isLoading = true;
    if ($stateParams.breadcrumbPath.length == 0) {
      addToBreadcrumb({ shortRef: folderUuid, name: 'Home' })
    }
    ContentService.getContentList(folderUuid)
      .then(function (response) {
        $scope.isLoading = false;
        $scope.crumbs = $stateParams.breadcrumbPath;
        $scope.lala = "lala";
        $scope.content = response;
      })
  }

  $scope.open = function (content) {
    switch (content.contentType) {
      case 'cmis:folder':
        $scope.folderUuid = content.shortRef;
        addToBreadcrumb(content)
        ContentService.setCurrentFolderNodeRef(content.nodeRef)
        break;
      case 'cmis:document':
        var shortRef = alfrescoNodeUtils.processNodeRef(content.nodeRef).id;
        $state.go('document', { doc: shortRef });
        break;
      default:
        console.log(content.nodeType + ' is not supported')
    }
  }

  $scope.openBreadcrumb = function (content) {
    var index = $stateParams.breadcrumbPath.indexOf(content) + 1;
    $stateParams.breadcrumbPath = $stateParams.breadcrumbPath.splice(0, index);
    $scope.folderUuid = content.nodeUuid;
  }

  function addToBreadcrumb(content) {
    $stateParams.breadcrumbPath.push({
      nodeUuid: content.shortRef,
      title: content.name
    })
  }
}