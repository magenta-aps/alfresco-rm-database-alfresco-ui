angular.module('openDeskApp.declaration', ['ngMaterial'])
    .config(config);

function config($stateProvider, USER_ROLES) {

    $stateProvider.state('declaration', {
            parent: 'site',
            url: '/erklaeringer',
            views: {
                'content@': {
                    templateUrl: 'app/src/declaration/view/info.html',
                    controller: 'DeclarationController',
                    controllerAs: 'vm'
                },
            }

        })
        .state('declaration.documents', {
            url: '/dokumenter',
            views: {
                'declarations': {
                    templateUrl: 'app/src/declaration/view/documents.html',
                    controller: 'DeclarationController',
                    controllerAs: 'vm'
                },
                'toolbar-tools@site': {
                    templateUrl: 'app/src/declaration/view/document-toolbar.html',
                    controller: 'DocumentToolbarController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('declaration.documents.edit', {

        })
        .state('declaration.patientdata', {
            url: '/patientdata',
            views: {
                'declarations': {
                    templateUrl: 'app/src/declaration/view/info-cards.html',
                    controller: 'DeclarationController',
                    controllerAs: 'vm'
                },
                'toolbar-tools@site': {
                    templateUrl: 'app/src/declaration/view/patient-info-toolbar.html',
                    controller: 'PatientInfoToolbarController',
                    controllerAs: 'vm'
                }
            }
        })

};