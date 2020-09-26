'use strict';

angular.module('oda.flowchart', ['oda.content', 'openDeskApp.filebrowser'])
  .config(config);

function config($stateProvider) {

  $stateProvider
    .state('flowchart', {
      parent: 'site',
      url: '/flowchart?:type',
      params: {
        path: "/flowchart",
        breadcrumbPath: []
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
