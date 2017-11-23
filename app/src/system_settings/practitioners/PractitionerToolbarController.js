'use strict';

angular
    .module('openDeskApp.declaration')
    .controller('PractitionerToolbarController', PractitionerToolbarController);

function PractitionerToolbarController($scope, practitionerService, groupService) {

    $scope.isEditing = false;

    $scope.toggleEdit = toggleEdit;
    $scope.saveChanges = saveChanges;
    
    function toggleEdit() {
        $scope.isEditing = !$scope.isEditing;
        practitionerService.setEdit($scope.isEditing);
    }

    
    function saveChanges() {
        var users = practitionerService.getUpdatedUsers();
        var original = practitionerService.getOriginalUsers();

        console.log(users);

        angular.forEach(users, function(user,key) {
            var addedTo = [];
            var removedFrom = [];

            practitionerService.getPermissionGroups().then(function (permissionGroups) {
                permissionGroups.forEach(function (group) {
                    if (user.hasOwnProperty(group)) {
                        if (user[group] && (!original[key][group] || !original[key].hasOwnProperty(group))) {
                            console.log(group);
                            addedTo.push(group);
                        }

                        if (!user[group] && (original[key][group] || !original[key].hasOwnProperty(group))) {
                            removedFrom.push(group);
                        }
                    }
                });

                if (addedTo.length > 0 || removedFrom.length > 0) {
                    groupService.updateUserRoles(user.userName, 'retspsyk', addedTo, removedFrom);
                }

                console.log('finished editing');
                practitionerService.setUsersBeforeEdit(users);
            });
        });
    }


}