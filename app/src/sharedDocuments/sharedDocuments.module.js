'use strict';

angular.module('oda.sharedDocuments', ['oda.content', 'openDeskApp.filebrowser'])
  .config(config);

function config($stateProvider) {

  $stateProvider
    .state('shared-documents', {
      parent: 'site',
      url: '/dokumenter',
      params: {
        path: "/Shared",
        breadcrumbPath: []
      },
      views: {
        'content@': {
          templateUrl: 'app/src/sharedDocuments/sharedDocuments.html',
          controller: 'SharedDocumentsController as vm'

        },
        'toolbar-tools-left@site': {
          template: '<h2>Dokumenter</h2>',
        }
      }

    });
}