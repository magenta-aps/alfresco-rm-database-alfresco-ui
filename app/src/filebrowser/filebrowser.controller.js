'use strict';

angular
    .module('openDeskApp.filebrowser')
    .controller('FilebrowserController', FilebrowserController);

function FilebrowserController($stateParams, $scope) {

    activate();

    function activate() {
        $scope.contentPath = $stateParams.path;
    }
}