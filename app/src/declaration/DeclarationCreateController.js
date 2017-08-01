'use strict';

angular
    .module('openDeskApp.declaration')
    .controller('DeclarationCreateController', DeclarationCreateController);

function DeclarationCreateController($scope, $rootScope, $timeout, entryService, propertyService, filterService, loadingService) {

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
}