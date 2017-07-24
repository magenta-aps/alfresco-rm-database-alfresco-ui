angular
    .module('openDeskApp.declaration')
    .controller('PractitionerController', PractitionerController);

function PractitionerController($scope, $state, $stateParams, practitionerService, userService, groupService) {

    $scope.practitionerService = practitionerService;

    var groupNames = ['GROUP_reopen_cases', 'GROUP_edit_lists', 'GROUP_assign_roles'];

    $scope.isEditing = false;
    $scope.allUsers = {};

    $scope.query = {
        order: 'firstName'
    }

    $scope.$watch('practitionerService.isEditing()', function (newVal) {
        $scope.isEditing = newVal;

        if(newVal) {
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

            groupNames.forEach(function (group) {
                groupService.getUserGroups(group).then(function (userGroup) {
                    console.log(userGroup);
                    angular.forEach(users, function (user) {
                        angular.forEach(userGroup.data, function(userInGroup) {
                            if(user.userName == userInGroup.shortName) {
                               user[group] = true;
                            }
                        })
                    });
                });
            });
            $scope.allUsers = users;
        });
    }

    init();

}