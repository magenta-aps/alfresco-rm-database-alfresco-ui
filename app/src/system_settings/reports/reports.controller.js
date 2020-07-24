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
       $http.post("/alfresco/s/database/retspsyk/weeklystat", {
        "method": "spreadsheetA",
        "year": vm.chartAval
      }).then(function (response) {
          console.log(response);

           if (response.data.NodeRef == "") {
               alert("der er ikke data til at kunne lave en graf for det indtastede år")
           }
           else {
               ContentService.download("workspace://SpacesStore/" + response.data.NodeRef, "uge.ods");
           }


      });
  }
  vm.chartA = chartA;

  function chartB() {
      $http.post("/alfresco/s/database/retspsyk/weeklystat", {
          "method": "spreadsheetB",
          "year": vm.chartBval
      }).then(function (response) {

          if (response.data.NodeRef == "") {
              alert("der er ikke data til at kunne lave en graf for det indtastede år")
          }
          else {
              ContentService.download("workspace://SpacesStore/" + response.data.NodeRef, "aar.ods");
          }


      });
  }
  vm.chartB = chartB;



}



