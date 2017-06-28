angular
    .module('openDeskApp.declaration')
    .controller('DocumentToolbarController', DocumentToolbarController);

function DocumentToolbarController($scope, documentToolbarService) {
    $scope.toggleIcon = 'list';

    $scope.toggleDocumentView = function() {
        documentToolbarService.toggleDocumentView();
        $scope.toggleIcon = documentToolbarService.getToggleIcon();
    }
}