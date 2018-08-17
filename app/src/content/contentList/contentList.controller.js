'use strict';

angular
  .module('oda.content')
  .controller('ContentListController', ContentListController);

function ContentListController($scope) {
  $scope.contentList;
  $scope.hasContent = false;

  $scope.$watch('contentList', function (newVal) {
    var contentLength = 0;
    angular.forEach(newVal, function (list) {
      contentLength += list.length;
    })
    $scope.hasContent = contentLength == 0 ? false : true
  })

  $scope.open = function (content) {
    $scope.clickAction()(content)
  }
}
