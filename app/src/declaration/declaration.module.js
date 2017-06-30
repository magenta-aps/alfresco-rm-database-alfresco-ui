angular.module('openDeskApp.declaration', ['ngMaterial'])
    .config(config);

function config($stateProvider, USER_ROLES) {

    $stateProvider.state('declaration', {
            parent: 'site',
            url: '/erklaeringer',
            views: {
                'content@': {
                    templateUrl: 'app/src/declaration/view/search.html',
                    controller: 'DeclarationSearchController',
                    controllerAs: 'vm'
                },
                'toolbar-tools@site': {
                    templateUrl: 'app/src/declaration/view/create-toolbar.html',
                    controller: 'DeclarationCreateToolbarController',
                },
            }
        })
        .state('declaration.create', {
            url: '/opret',
            views: {
                'content@': {
                    templateUrl: 'app/src/declaration/view/info-cards.html',
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
        .state('declaration.show', {
            url: '/:caseid',
            views: {
                'content@': {
                    templateUrl: 'app/src/declaration/view/declaration.html',
                    controller: 'DeclarationController',
                    controllerAs: 'vm'
                },
            },
            redirectTo: 'declaration.show.patientdata'
        })
        .state('declaration.show.documents', {
            url: '/dokumenter',
            views: {
                'declarations': {
                    templateUrl: 'app/src/declaration/view/documents.html',
                    controller: 'DocumentController',
                    controllerAs: 'vm'
                },
                'toolbar-tools@site': {
                    templateUrl: 'app/src/declaration/view/document-toolbar.html',
                    controller: 'DocumentToolbarController',
                    controllerAs: 'vm'
                },
                'toolbar-label@site': {
                    templateUrl: 'app/src/declaration/view/patient-toolbar.html',
                    controller: 'PatientInfoToolbarController',
                }
            }
        })
        .state('declaration.show.documents.edit', {
            url: '/rediger'
        })
        .state('declaration.show.patientdata', {
            url: '/patientdata',
            views: {
                'declarations': {
                    templateUrl: 'app/src/declaration/view/info-cards.html',
                    controller: 'PatientInfoController',
                    controllerAs: 'vm'
                },
                'toolbar-tools@site': {
                    templateUrl: 'app/src/declaration/view/patient-info-toolbar.html',
                    controller: 'PatientInfoToolbarController',
                    controllerAs: 'vm'
                },
                'toolbar-label@site': {
                    templateUrl: 'app/src/declaration/view/patient-toolbar.html',
                    controller: 'PatientInfoToolbarController',
                }
            }
        })
        .state('declaration.show.patientdata.edit', {
            url: '/rediger'
        })

};