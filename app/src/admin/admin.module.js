angular.module('openDeskApp.administration', ['ngMaterial', 'pascalprecht.translate'])
        .config(config);

function config($stateProvider, USER_ROLES) {

    $stateProvider.state('administration', {
        parent: 'site',
        url: '/administration',
        views: {
            'content@': {
                templateUrl: 'app/src/admin/view/admin.html',
                controller: 'AdminController',
                controllerAs: 'vm'
            },
            'toolbar-tools-left@site': {
                template: "<h2>{{ 'ADMIN.ADMINISTRATION' | translate }}</h2>"
            }
        },
        params: {
            authorizedRoles: [USER_ROLES.user]
        },
        redirectTo: 'administration.systemsettings'
    })

};