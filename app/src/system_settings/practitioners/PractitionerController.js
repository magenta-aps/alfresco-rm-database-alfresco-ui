angular
    .module('openDeskApp.declaration')
    .controller('PractitionerController', PractitionerController);

function PractitionerController($scope, $state, $stateParams, userService, groupService) {

    var groupNames = ['GROUP_reopen_cases', 'GROUP_edit_lists', 'GROUP_assign_roles'];

    $scope.groups = {};

    function init() {
        userService.getAllUsers().then(function (response) {

            var users = response.people;

            groupNames.forEach(function (group) {
                groupService.getUserGroups(group).then(function (userGroup) {
                    console.log(group);
                    console.log(userGroup.data);

                    angular.forEach(users, function (user) {
                        console.log('check bruger ' + user.userName);
                        for (var i = 0; i < userGroup.data.length; i++) {

                            if(user.userName == userGroup.data[0].shortName) {
                                console.log(user.userName + ' er paa listen ' + group);
                                user[group] = true;
                            }
                        }
                    })
                });
            }, this);

            console.log(users);

            $scope.allUsers = response.people;
        });
    }

    init();

    // $scope.isUserInGroup = function (userName, groupShortName) {
    //     var usersInGroup = $scope.groups[groupShortName];

    //     if (usersInGroup == undefined) {

    //     }

    //     for (var i = 0; i < usersInGroup.length; i++) {
    //         if (userName == usersInGroup[i].shortName) {
    //             console.log('is in list');
    //             return true;
    //             break;
    //         }
    //     }

    //     return false;
    // }
}