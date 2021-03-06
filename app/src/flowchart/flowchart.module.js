'use strict';

angular.module('oda.flowchart', ['oda.content', 'openDeskApp.filebrowser'])
  .config(config);

function config($stateProvider) {

  $stateProvider
    .state('flowchart', {
      parent: 'site',
      url: '/flowchart',
      params: {
        path: "/flowchart",
        breadcrumbPath: [],
        declarationShortcutId: null,
        category: null
      },
      views: {
        'content@': {
          templateUrl: 'app/src/flowchart/flowchart.html',
          controller: 'FlowChartController as vm'

        },
        'toolbar-tools-left@site': {
          template: '<h2>flowchart</h2>',
        }
      }

    });
}

