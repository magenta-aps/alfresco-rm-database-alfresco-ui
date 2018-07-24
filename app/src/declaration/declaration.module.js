'use strict';

angular.module('openDeskApp.declaration', ['oda.authorityMail', 'openDeskApp.filebrowser'])
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
            }
        }
    })
        .state('declaration.advancedSearch', {
            url: '/advanceret-soegning',
            views: {
                'content@': {
                    templateUrl: 'app/src/declaration/advancedSearch/advancedSearch.view.html',
                    controller: 'AdvancedSearchController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('declaration.waitinglist', {
            url: '/venteliste',
            views: {
                'content@': {
                    templateUrl: 'app/src/waitinglist/waitinglist.view.html',
                    controller: 'WaitinglistController',
                    controllerAs: 'vm'
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
                }
            }
        })
        .state('declaration.create-bua', {
            url: '/opret-bua',
            views: {
                'content@': {
                    templateUrl: 'app/src/declaration/view/info-cards.html',
                    controller: 'DeclarationCreateController',
                    controllerAs: 'vm'
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
            params: {
                path: "/Sites/retspsyk/documentLibary",
                breadcrumbPath: []
            },
            views: {
                'declarations': {
                    templateUrl: 'app/src/declaration/view/documents.html',
                    controller: 'DeclarationDocumentController',
                    controllerAs: 'vm'
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
                }
            }
        })
        .state('declaration.show.patientdata.edit', {

        });
}