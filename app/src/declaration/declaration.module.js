'use strict';

angular.module('openDeskApp.declaration', ['oda.authorityMail'])
    .config(config);

function config($stateProvider, USER_ROLES) {

    $stateProvider.state('declaration', {
            parent: 'site',
            url: '/erklaeringer',
            views: {
                'content@': {
                    templateUrl: 'app/src/declaration/search/search.view.html',
                    controller: 'DeclarationSearchController',
                    controllerAs: 'vm'
                },
                'toolbar-tools-right@site': {
                    templateUrl: 'app/src/declaration/view/create-toolbar.html',
                    controller: 'DeclarationCreateToolbarController',
                    controllerAs: 'vm'
                },
            }
        })
        .state('declaration.advancedSearch', {
            url: '/advanceret-soegning',
            views: {
                'content@': {
                    templateUrl: 'app/src/declaration/advancedSearch/advancedSearch.view.html',
                    controller: 'AdvancedSearchController',
                    controllerAs: 'vm'
                },
                'toolbar-tools-left@site': {
                    template: "<md-button class='md-icon-button' aria-label='Back' ui-sref='declaration'><md-icon>arrow_back</md-icon></md-button><span>{{'DECLARATION.ADVANCED_SEARCH' | translate}}</span>"
                }
            }
        })
        .state('declaration.waitinglist', {
            url: '/venteliste',
            views: {
                'content@': {
                    templateUrl: 'app/src/declaration/waitinglist/waitinglist.view.html',
                    controller: 'WaitinglistController',
                    controllerAs: 'vm'
                },
                'toolbar-tools-left@site': {
                    template: "<h2>{{'DECLARATION.WAITINGLIST' | translate}}</h2>"
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
                    controllerAs: 'vm'
                },
                'toolbar-tools-left@site': {
                    template: "<h2>Opret ny sag</h2>"
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
                    controller: 'DeclarationDocumentController',
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
                    controller: 'DeclarationDocumentController',
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
        .state('declaration.documents', {
            url: '/dokumenter',
            params: {
                path: "/Shared",
            },
            views: {
                'content@': {
                    templateUrl: 'app/src/filebrowser/view/filebrowserCard.html',
                    controller: 'SystemSettingsController',
                    controllerAs: 'vm'
                },
                'toolbar-tools-left@site': {
                    template: '<h2>Dokumenter</h2>',
                }
            }

        });
}