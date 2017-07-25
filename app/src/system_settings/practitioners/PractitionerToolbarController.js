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

        var groupNames = ['GROUP_reopen_cases', 'GROUP_edit_lists', 'GROUP_assign_roles'];

        users.forEach(function (user, key) {
            var addedTo = [];
            var removedFrom = [];

            groupNames.forEach(function (group) {
                if (user.hasOwnProperty(group)) {
                    if (user[group] && (!original[key][group] || !original[key].hasOwnProperty(group))) {
                        addedTo.push(group);
                    }

                    if(!user[group] && (original[key][group] || !original[key].hasOwnProperty(group))) {
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
        }, this);
    }


}