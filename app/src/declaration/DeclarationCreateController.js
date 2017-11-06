'use strict';

angular
    .module('openDeskApp.declaration')
    .controller('DeclarationCreateController', DeclarationCreateController);

function DeclarationCreateController($scope, $rootScope, $timeout, $mdToast, entryService, propertyService, filterService, loadingService, cprService) {

    $scope.editPatientData = true;
    $scope.case = {};
    $scope.case.biDiagnoses = [];
    $scope.case.creationDate = new Date();
    $scope.propertyValues = propertyService.getAllPropertyValues();

    entryService.setLoading(true);

    $timeout(function () {
        loadingService.setLoading(false);
    });

    $scope.$watch('case', function (newVal, oldVal) {
        entryService.updateNewCase(newVal);
    }, true);


    $scope.propertyFilter = function(array, query) {
        return filterService.propertyFilter(array, query);
    }

    $scope.addNewBidiagnosis = function () {
        var newItemNo = $scope.case.biDiagnoses.length + 1;
        if ($scope.case.biDiagnoses.indexOf(null) < 0) {
            $scope.case.biDiagnoses.push(null);
        }
    };

    $scope.lookupCPR = function () {
        cprService.getCPRData($scope.case.cprNumber).then(function(response) {
            var res = response.data[0];
            console.log(response.data[0]);
            var name = res.NAVN.split(',');

            $scope.case.firstName = name[1];
            $scope.case.lastName = name[0];
            $scope.case.address = res.GADE;
            $scope.case.postbox = res.POSTNR;
            $scope.case.city = res.BY;
            
        }).error(function(err) {
            $mdToast.show(
                $mdToast.simple()
                  .textContent('Ingen person med CPR nummeret ' + $scope.case.cprNumber)
                  .position('top right')
                  .hideDelay(3000)
              );
        });
    }
}