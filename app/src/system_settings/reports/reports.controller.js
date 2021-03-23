'use strict';

angular
  .module('openDeskApp.systemsettings')
  .controller('ReportsController', ReportsController);

function ReportsController($scope, $stateParams, ContentService, HeaderService, $http, $filter ) {
  var vm = this;

  $scope.folderUuid = [];

  HeaderService.resetActions();

  vm.chartAval = "";
  vm.chartBval = "";

  vm.createdFromDate = null;
  vm.createdToDate = null;

  vm.disableVentetiderButton = true;

    $scope.$watch('vm.createdFromDate', function (newVal) {
        if (newVal) {
            if (vm.createdToDate != null) {
                vm.disableVentetiderButton = false;
            }
        }
        else {
            vm.disableVentetiderButton = true;
        }
    })

    $scope.$watch('vm.createdToDate', function (newVal) {
        if (newVal) {
            if (vm.createdFromDate != null) {
                vm.disableVentetiderButton = false;
            }
        }
        else {
            vm.disableVentetiderButton = true;
        }
    })




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

  function ventetidsRapport() {
      var query = {};

      if (vm.createdFromDate != null) {
            query.createdFromDate= $filter('date')(vm.createdFromDate,'yyyy-MM-dd');
            query.createdToDate= $filter('date')(vm.createdToDate,'yyyy-MM-dd');
        }
      console.log("query.createdFromDate");
      console.log(query.createdFromDate);
      console.log(query.createdToDate);
  }

    vm.ventetidsrapport = ventetidsRapport;





}



