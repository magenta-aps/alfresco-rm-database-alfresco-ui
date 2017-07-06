angular
    .module('openDeskApp.declaration')
    .controller('DocumentToolbarController', DocumentToolbarController);

function DocumentToolbarController($scope, $mdDialog, documentToolbarService) {
    $scope.toggleIcon = 'list';

    $scope.case;

    $scope.toggleDocumentView = function () {
        documentToolbarService.toggleDocumentView();
        $scope.toggleIcon = documentToolbarService.getToggleIcon();
    }

    $scope.uploadDocumentsDialog = function (event) {
        $mdDialog.show({
            controller: 'DocumentActionController',
            controllerAs: 'vm',
            templateUrl: 'app/src/sites/view/uploadDocuments.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: event,
            scope: $scope, // use parent scope in template
            preserveScope: true, // do not forget this if use parent scope
            clickOutsideToClose: true
        });
    };

    $scope.deleteDocumentsDialog = function (event) {
        $mdDialog.show({
            controller: 'DocumentActionController',
            controllerAs: 'vm',
            templateUrl: 'app/src/declaration/view/deleteFiles.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: event,
            scope: $scope, // use parent scope in template
            preserveScope: true, // do not forget this if use parent scope
            clickOutsideToClose: true
        });
    }
}