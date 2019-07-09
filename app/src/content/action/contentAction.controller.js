'use strict';

angular
  .module('oda.content')
  .controller('ContentActionController', ContentActionController);

function ContentActionController($scope, $mdDialog, ContentService, $state) {

  var vm = this;
  vm.contentList = [];

  vm.folders = [];
  vm.selected = "";
  $scope.content;
  $scope.newName;



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

    vm.folders.push({nodeRef : "parent" , name: "overliggende mappe"});


    if ($scope.folderList != undefined) {

        for (var i = 0; i<= $scope.folderList.length-1;i++) {

                var folderName = $scope.folderList[i].name;

                    if (folderName !== vm.contentList[0].name) {
                        vm.folders.push($scope.folderList[i])
                    }
        }

    }




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


  $scope.renameDialog = function () {
    $mdDialog.show({
      templateUrl: 'app/src/content/action/rename.view.html',
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

  $scope.move = function (selected) {
        ContentService.move(vm.contentList, selected)
          .then(function () {
            $scope.cancelDialog();
            $state.reload();
          });
      };


  $scope.rename = function () {
      angular.forEach(vm.contentList, function (content) {
        ContentService.rename(content.nodeRef, $scope.newName)
          .then(function () {
            $scope.cancelDialog();
          });
      })
    }

}
