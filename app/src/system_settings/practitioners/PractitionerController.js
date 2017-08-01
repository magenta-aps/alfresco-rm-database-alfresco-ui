angular
    .module('openDeskApp.declaration')
    .controller('PractitionerController', PractitionerController);

function PractitionerController($scope, $state, $stateParams, $timeout, practitionerService, userService, groupService, loadingService) {

    $scope.practitionerService = practitionerService;

    // var groupNames = ['GROUP_reopen_cases', 'GROUP_edit_lists', 'GROUP_assign_roles'];

    $scope.isEditing = false;
    $scope.allUsers = [];

    $scope.query = {
        order: 'firstName'
    }

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

    function init() {
        userService.getAllUsers().then(function (response) {

            var users = response.people;

            practitionerService.getPermissionGroups().then(function(permissionGroups) {
                permissionGroups.forEach(function (group) {
                    groupService.getUserGroups(group).then(function (userGroup) {
                        angular.forEach(users, function (user) {
                            angular.forEach(userGroup.data, function (userInGroup) {
                                if (user.userName == userInGroup.shortName) {
                                    user[group] = true;
                                }
                            })
                        });
                    },function(err) { 
                        console.log(err);
                    });
                });
            });

            $scope.allUsers = users;
        });
    }

    init();

}