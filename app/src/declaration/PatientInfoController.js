angular
    .module('openDeskApp.declaration')
    .controller('PatientInfoController', PatientInfoController);

function PatientInfoController($scope, $rootScope, $state, $stateParams, entryService, filterService, loadingService, cprService) {

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

    $scope.addNewBidiagnosis = function () {
        console.log('add new bidiagnosis');
        // var newItemNo = $scope.case.biDiagnoses.length + 1;
        console.log($scope.case.biDiagnoses.indexOf(''));

        if ($scope.case.biDiagnoses.indexOf('') < 0) {
            $scope.case.biDiagnoses.push('');
        }

        console.log($scope.case.biDiagnoses);
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