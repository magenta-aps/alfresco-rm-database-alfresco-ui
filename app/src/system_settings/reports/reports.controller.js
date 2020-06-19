'use strict';

angular
  .module('openDeskApp.systemsettings')
  .controller('ReportsController', ReportsController);

function ReportsController($scope, $stateParams, ContentService, HeaderService, $http ) {
  var vm = this;

  $scope.folderUuid = [];

  HeaderService.resetActions();

  vm.chartAval = "";
  vm.chartBval = "";

  function chartA() {

      console.log("chartA");
      console.log(vm.chartAval);

       $http.post("/alfresco/s/database/retspsyk/weeklystat", {
        "method": "spreadsheetA",
        "year": vm.chartAval
      }).then(function (response) {
           ContentService.download("workspace://SpacesStore/" + response.data.NodeRef, "uge.ods");
      });
  }
  vm.chartA = chartA;

  function chartB() {
      $http.post("/alfresco/s/database/retspsyk/weeklystat", {
          "method": "spreadsheetB",
          "year": vm.chartBval
      }).then(function (response) {
          ContentService.download("workspace://SpacesStore/" + response.data.NodeRef, "aar.ods");
      });
  }
  vm.chartB = chartB;

  console.log("hey2");

}



