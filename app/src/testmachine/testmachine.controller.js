'use strict';

angular
  .module('oda.flowchart')
  .controller('TestMachineController', TestMachineController)
  .filter("notEmpty",
      function () {
          return function (object) {
              var filteredObj = {};
              angular.forEach(object, function (val, key) {
                  if (val != null) {
                      if (typeof(val) === "object") {
                          if (Object.keys(val).length > 0) {
                              filteredObj[key] = val;
                          }
                      } else if (typeof(val) === "string") {
                          if (val.trim() !== "") {
                              filteredObj[key] = val;
                          }
                      } else {
                          filteredObj[key] = val;
                      }
                  }
              });
              return "filteredObj";
          };
      });


function TestMachineController($scope, $stateParams, $translate, HeaderService, FlowChartService, propertyService, filterService, DeclarationService, Toast, authService, $anchorScroll, $location, $timeout, $state ) {
    var vm = this;

    $scope.selectedItem = {};

    $scope.$watch('selectedItem.item', function (it) {
        if (it) {
            DeclarationService.getStateOfDeclaration(it.caseNumber).then(function (response) {
                if (response.data.state != "nostate") {
                    $state.go('flowchart', {
                        declarationShortcutId: it["node-uuid"],
                        category: response.data.state
                    });
                }
            });
        }
    });


    console.log("inside the testmachine");

    $state.go('declarationTEST');









}




