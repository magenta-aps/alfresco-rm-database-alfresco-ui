'use strict';

angular.module('oda.flowchart', ['oda.content', 'openDeskApp.filebrowser'])
  .config(config);

function config($stateProvider) {

  $stateProvider
    .state('testmachine', {
      parent: 'site',
      url: '/testmachine',
      params: {
        path: "/testmachine",
        breadcrumbPath: [],
        declarationShortcutId: null,
        category: null
      },
      views: {
        'content@': {
          templateUrl: 'app/src/testmachine/testmachine.html',
          controller: 'TestMachineController as vm'
        },
        'toolbar-tools-left@site': {
          template: '<h2>flowchart</h2>',
        }
      }

    });
}

