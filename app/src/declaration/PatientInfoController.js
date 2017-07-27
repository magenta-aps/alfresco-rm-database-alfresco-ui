angular
    .module('openDeskApp.declaration')
    .controller('PatientInfoController', PatientInfoController);

function PatientInfoController($scope, $state, $stateParams, declarationService, filterService) {

    $scope.declarationService = declarationService;
    $scope.editPatientData = false;
    $scope.case = {};

    $scope.waitTime = {
        passive: null,
        active: null,
        total: null
    };

    $scope.$watch('declarationService.getCurrentCase()', function (newVal) {
        $scope.case = newVal;
    });

    $scope.$watch('declarationService.isEditing()', function (newVal) {
        $scope.editPatientData = newVal;
    });

    $scope.$watch('case', function (newVal) {
        declarationService.updateNewCase(newVal);
        $scope.waitTime = getWaitingTimes(newVal);
    }, true);

    $scope.dropdownFilter = function(array, query) {
        return filterService.dropdownFilter(array, query);
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