angular
    .module('openDeskApp.declaration')
    .controller('DocumentToolbarController', DocumentToolbarController);

function DocumentToolbarController($scope, $mdDialog, declarationService, documentToolbarService, documentService, documentPreviewService, alfrescoDownloadService) {
    $scope.toggleIcon = 'list';

    $scope.case;

    $scope.declarationService = declarationService;

    $scope.$watch('declarationService.getCurrentCase()', function (newVal) {
        console.log(newVal);
        $scope.case = newVal;
    });

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


    $scope.downloadDocuments = function (event) {
        console.log('download documents');

        var files = documentService.getSelectedFiles();

        console.log(files);

        files.forEach(function (file) {
            console.log('download ' + file.nodeRef);
            documentPreviewService.previewDocumentPlugin(file.nodeRef).then(function (plugin) {
                console.log('initiated ' + plugin.fileName);
                alfrescoDownloadService.downloadFile(plugin.nodeRef, plugin.fileName);
            });
        });

    };
}