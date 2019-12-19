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


  console.log("hvad er crumbs");
  console.log($scope.crumbs);

  console.log("£scope");
  console.log("£scope");
  console.log("£scope");
  console.log("£scope");



  console.log($scope);






  if ($stateParams.tmpNodeRef != null) {
     console.log("doing the thing:");
     console.log($stateParams.tmpNodeRef);
     console.log("$scope.folderUuid");
     console.log($scope.folderUuid);

      $scope.folderUuid = $stateParams.tmpNodeRef;

      console.log("###################$scope.folderUuid");
      console.log($scope.folderUuid);


      console.log($scope);

  }


    console.log("£scope efter ");
    console.log("£scope efter ");
    console.log("£scope efter ");
    console.log("£scope efter ");




    console.log($scope);



  $scope.$watch('folderUuid', function (newVal) {
    console.log("watch folderUuid");
    console.log("hvad er newVal");
    console.log(newVal);


      if ($stateParams.tmpNodeRef != null) {
          console.log("duffff");
          $stateParams.tmpNodeRef = null;

      }
      else {
          console.log("den er hiel gal");
          console.log(newVal);
          if (newVal) getContent(newVal);
      }
  })

  $scope.$watch('content', function (contentList) {
      console.log("watch content");
      console.log("hvad er contentList");
      console.log(contentList);
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
    console.log("updateFilebrowser");
    getContent($scope.folderUuid);
  })

  function getContent(folderUuid) {
    $scope.isLoading = true;
    if ($stateParams.breadcrumbPath.length == 0) {
      addToBreadcrumb({ shortRef: folderUuid, name: 'Home' })
    }
    ContentService.getContentList(folderUuid)
      .then(function (response) {
          console.log("hvad er folderuuuid");
          console.log(folderUuid);

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
        $state.go('document', { doc: shortRef, tmpcrumb: $scope.crumbs, tmpNodeRef: $scope.folderUuid });
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

   function showEditVersionDialog (editor) {
      $scope.editor = editor
      $mdDialog.show({
        template: confirmEditVersionDialogTemplate,
        scope: $scope,
        preserveScope: true,
        clickOutsideToClose: true
      })
    }

  function addToBreadcrumb(content) {
    $stateParams.breadcrumbPath.push({
      nodeUuid: content.shortRef,
      title: content.name
    })
  }
}