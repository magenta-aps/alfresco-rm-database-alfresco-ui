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
                'toolbar-tools-right@site': {
                    templateUrl: 'app/src/declaration/view/create-toolbar.html',
                    controller: 'DeclarationCreateToolbarController',
                },
            }
        })
        .state('declaration.advancedSearch', {
            url: '/advanceret-soegning',
            views: {
                'content@': {
                    templateUrl: 'app/src/declaration/view/search-advanced.html',
                    controller: 'DeclarationSearchController',
                    controllerAs: 'vm'
                },
                'toolbar-tools-left@site': {
                    template: "<md-button class='md-icon-button' aria-label='Back' ui-sref='declaration'><md-icon>arrow_back</md-icon></md-button><span>Advanceret søgning</span>"
                }
            }
        })
        .state('declaration.waitinglist', {
            url: '/venteliste',
            views: {
                'content@': {
                    templateUrl: 'app/src/declaration/view/waitinglist.html',
                    controller: 'DeclarationSearchController',
                    controllerAs: 'vm'
                },
                'toolbar-tools-left@site': {
                    template: "<h2>Venteliste</h2>"
                }
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
                'toolbar-tools-right@site': {
                    templateUrl: 'app/src/declaration/view/create-toolbar.html',
                    controller: 'DeclarationCreateToolbarController',
                },
                'toolbar-tools-left@site': {
                    template: "<h2>Opret ny erklæring</h2>"
                }
            }
        })
        .state('declaration.show', {
            url: '/sag/:caseid',
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
                'toolbar-tools-right@site': {
                    templateUrl: 'app/src/declaration/view/document-toolbar.html',
                    controller: 'DocumentToolbarController',
                    controllerAs: 'vm'
                },
                'toolbar-tools-left@site': {
                    templateUrl: 'app/src/declaration/view/patient-toolbar.html',
                    controller: 'PatientInfoToolbarController',
                }
            }
        })
        .state('declaration.show.documents.view-file', {
            url: '/:nodeid',
            views: {
                'declarations@declaration.show': {
                    templateUrl: 'app/src/declaration/view/document-view.html',
                    controller: 'DocumentController',
                },
                'toolbar-tools-right@site': {
                    template: '',
                }
            }
        })
        .state('declaration.show.documents.edit', {
        })
        .state('declaration.show.patientdata', {
            url: '/patientdata',
            views: {
                'declarations': {
                    templateUrl: 'app/src/declaration/view/info-cards.html',
                    controller: 'PatientInfoController',
                    controllerAs: 'vm'
                },
                'toolbar-tools-right@site': {
                    templateUrl: 'app/src/declaration/view/patient-info-toolbar.html',
                    controller: 'PatientInfoToolbarController',
                    controllerAs: 'vm'
                },
                'toolbar-tools-left@site': {
                    templateUrl: 'app/src/declaration/view/patient-toolbar.html',
                    controller: 'PatientInfoToolbarController',
                }
            }
        })
        .state('declaration.show.patientdata.edit', {
            
        })

};