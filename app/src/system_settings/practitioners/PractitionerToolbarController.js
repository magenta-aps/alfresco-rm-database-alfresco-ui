angular
    .module('openDeskApp.declaration')
    .controller('PractitionerToolbarController', PractitionerToolbarController);

function PractitionerToolbarController($scope, practitionerService, groupService) {

    $scope.isEditing = false;

    $scope.toggleEdit = function () {
        $scope.isEditing = !$scope.isEditing;
        practitionerService.setEdit($scope.isEditing);
    }

    $scope.saveChanges = function () {
        var users = practitionerService.getUpdatedUsers();
        var original = practitionerService.getOriginalUsers();

        users.forEach(function (user, key) {
            var addedTo = [];
            var removedFrom = [];

            practitionerService.getPermissionGroups().then(function (permissionGroups) {
                permissionGroups.forEach(function (group) {
                    if (user.hasOwnProperty(group)) {
                        if (user[group] && (!original[key][group] || !original[key].hasOwnProperty(group))) {
                            addedTo.push(group);
                        }

                        if (!user[group] && (original[key][group] || !original[key].hasOwnProperty(group))) {
                            removedFrom.push(group);
                        }
                    }
                });

                if (addedTo.length > 0) {
                    groupService.addUserToGroups(user.userName, addedTo);
                }

                if (removedFrom.length > 0) {
                    groupService.removeUserFromGroups(user.userName, removedFrom);
                }

                console.log('finished editing');
                practitionerService.setUsersBeforeEdit(users);
            });
        }, this);
    }


}