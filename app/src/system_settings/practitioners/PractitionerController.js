'use strict';

angular
    .module('openDeskApp.declaration')
    .controller('PractitionerController', PractitionerController);

function PractitionerController($scope, $timeout, practitionerService, loadingService) {

    $scope.practitionerService = practitionerService;

    $scope.isEditing = false;
    $scope.allUsers = [];

    $scope.query = {
        order: 'firstName'
    };

    loadingService.setLoading(true);

    $timeout(function () {
        loadingService.setLoading(false);
    });

    $scope.$watch('practitionerService.isEditing()', function (newVal) {
        $scope.isEditing = newVal;

        if (newVal) {
            var users = angular.copy($scope.allUsers);
            practitionerService.setUsersBeforeEdit(users);
        }
    });

    $scope.$watch('allUsers', function (newVal) {
        practitionerService.updateUsers(newVal);
    }, true);

    init();

    function init() {
        practitionerService.getUserPermissions().then(function(response) {
            $scope.allUsers = response.data
        })
    }


}