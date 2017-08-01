angular
    .module('openDeskApp.declaration')
    .controller('PatientInfoController', PatientInfoController);

function PatientInfoController($scope, $rootScope, $state, $stateParams, entryService, filterService, loadingService) {

    $scope.entryService = entryService;
    $scope.loadingService = loadingService;
    $scope.editPatientData = false;
    $scope.case = {};

    $scope.waitTime = {
        passive: null,
        active: null,
        total: null
    };

    loadingService.setLoading(true);

    angular.element(document).ready(function() {
        loadingService.setLoading(false);
    });

    $scope.$watch('entryService.getCurrentCase()', function (newVal) {
        $scope.case = newVal;
    });



    $scope.$watch('entryService.isEditing()', function (newVal) {
        $scope.editPatientData = newVal;
    });

    $scope.$watch('case', function (newVal) {
        entryService.updateNewCase(newVal);
        $scope.waitTime = getWaitingTimes(newVal);
    }, true);

    $scope.propertyFilter = function(array, query) {
        return filterService.propertyFilter(array, query);
    }

    function getWaitingTimes(res) {
        var creationDate = new Date(res.creationDate);
        var observationDate = new Date(res.observationDate);
        var declarationDate = new Date(res.declarationDate);

        var wait = {};

        wait.passive = Math.ceil((observationDate - creationDate) / 1000 / 60 / 60 / 24);
        wait.active = Math.ceil((declarationDate - observationDate) / 1000 / 60 / 60 / 24);
        wait.total = Math.ceil((declarationDate - creationDate) / 1000 / 60 / 60 / 24);

        return wait;
    }

}