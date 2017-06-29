angular.module('openDeskApp.declaration', ['ngMaterial'])
    .config(config);

function config($stateProvider, USER_ROLES) {

    $stateProvider.state('declaration', {
            parent: 'site',
            url: '/erklaeringer',
            views: {
                'content@': {
                    templateUrl: 'app/src/declaration/view/search.html',
                    controller: 'DeclarationController',
                    controllerAs: 'vm'
                },
                'toolbar-tools@site': {
                    templateUrl: 'app/src/declaration/view/search-toolbar.html',
                    controller: 'SearchToolbarController',
                },
            }
        })
        .state('declaration.create', {
            url: '/opret',
            views: {
                'content@': {
                    templateUrl: 'app/src/declaration/view/create.html',
                    controller: 'DeclarationCreateController',
                    controllerAs: 'vm'
                },
                'toolbar-tools@site': {
                    templateUrl: 'app/src/declaration/view/create-toolbar.html',
                    controller: 'DeclarationCreateToolbarController',
                },
                'toolbar-label@site': {
                    template: "<h2>Opret ny erklæring</h2>"
                }
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
                },
                'toolbar-label@site': {
                    templateUrl: 'app/src/declaration/view/patient-toolbar.html',
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
                },
                'toolbar-label@site': {
                    templateUrl: 'app/src/declaration/view/patient-toolbar.html',
                }
            }
        })

};