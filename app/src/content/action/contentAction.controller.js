'use strict';

angular
  .module('oda.content')
  .controller('ContentActionController', ContentActionController);

function ContentActionController($scope, $mdDialog, ContentService) {

  var vm = this;
  vm.contentList = [];
  vm.folderList = [];

  $scope.content;
  $scope.flemming;

    console.log("hvad er $scope.flemming")
    console.log($scope.flemming);


  $scope.action = {
    move: false,
    delete: false,
    rename: false,
    edit: false,
    download: false
  }

  activate();

  function activate() {


    if (($scope.content instanceof Array)) {
      vm.contentList = angular.copy($scope.content);

    } else {
      vm.contentList = [angular.copy($scope.content)];
    }

    if ($scope.selectedContent) {
      vm.contentList = $scope.selectedContent;
    }

//    console.log("size på contentList");
//    console.log($scope);
//    console.log("slut");

//    for (var x in vm.contentList) {
//
//        if (vm.contentList[x].contentType == "cmis:folder") {
//            var o = {};
//            o.name = vm.contentList[x].name;
//            o.nodeRef = vm.contentList[x].nodeRef;
//
//            vm.folderList.push(o);
//        }
//    }
//
//    console.log("do");
//    console.log(vm.folderList);


//    vm.folderList = $scope.content;
//    console.log("hvad er:")
//    console.log(vm.folderList);

    if (vm.contentList.length == 0) return;

    switch (vm.contentList[0].contentType) {
      case 'cmis:folder':
        $scope.action.rename = true;
        $scope.action.delete = true;
        $scope.action.move = true;
        break;
      case 'cmis:document':
        $scope.action.move = true
        $scope.action.download = true
        $scope.action.rename = true;
        $scope.action.delete = true;
        break;
    }
  }

  $scope.download = function (nodeRef, name) {
    ContentService.download(nodeRef, name);
  }

  $scope.deleteDialog = function () {
    $mdDialog.show({
      templateUrl: 'app/src/content/action/delete.view.html',
      scope: $scope, // use parent scope in template
      preserveScope: true, // do not forget this if use parent scope
      clickOutsideToClose: true
    });
  }

  $scope.moveDialog = function () {
    $mdDialog.show({
      templateUrl: 'app/src/content/action/move.view.html',
      scope: $scope, // use parent scope in template
      preserveScope: true, // do not forget this if use parent scope
      clickOutsideToClose: true
    });
  }

  $scope.cancelDialog = function () {
    $mdDialog.cancel();
  }

  $scope.delete = function () {
    angular.forEach(vm.contentList, function (content) {
      ContentService.delete(content.nodeRef)
        .then(function () {
          $scope.cancelDialog();
        });
    })
  }

  $scope.move = function () {
        ContentService.move(vm.contentList, vm.destination)
          .then(function () {
            $scope.cancelDialog();
          });
      };

}
