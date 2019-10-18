'use strict';

angular
  .module('oda.flowchart')
  .controller('FlowChartController', FlowChartController);

function FlowChartController($scope, $stateParams, $translate, HeaderService) {
  var vm = this;



  $scope.folderUuid = [];

  HeaderService.setTitle($translate.instant('COMMON.FLOWCHART'))
  activate();

  vm.updateCollapse = updateCollapse;


 function updateCollapse() {
     vm.collapse = !vm.collapse;
     console.log("clicked");
   }

  function activate() {
    $scope.isLoading = true;



  }
}