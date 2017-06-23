angular.module('openDeskApp.declaration', ['ngMaterial'])
    .config(config);

function config($stateProvider, USER_ROLES) {

    $stateProvider.state('declaration', {
        parent: 'site',
        url: '/declaration',
        views: {
            'content@': {
                templateUrl: 'app/src/declaration/view/info.html',
                controller: 'DeclarationController',
                controllerAs: 'vm'
            }
        }

    })

};