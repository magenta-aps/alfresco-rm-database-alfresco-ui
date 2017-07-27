angular
    .module('openDeskApp.declaration')
    .controller('DocumentToolbarController', DocumentToolbarController);

function DocumentToolbarController($scope, $mdDialog, declarationService, documentToolbarService, documentService,
    preferenceService, authService, documentPreviewService, alfrescoDownloadService) {

    $scope.toggleIcon = 'list';

    $scope.case;

    var currentUser = authService.getUserInfo().user;

    preferenceService.getPreferences(currentUser.userName, 'dk.magenta.sites.retspsyk.tableView').then(function (response) {
        $scope.toggleIcon = response['dk.magenta.sites.retspsyk.tableView'] == 'true' ? 'view_module' : 'list';
    });

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

        if (files.length == 1) {
            files.forEach(function (file) {
                console.log('download ' + file.nodeRef);
                documentPreviewService.previewDocumentPlugin(file.nodeRef).then(function (plugin) {
                    console.log('initiated ' + plugin.nodeRef);
                    alfrescoDownloadService.downloadFile(plugin.nodeRef, plugin.fileName);
                });
            });
            return;
        }

        documentService.downloadFiles(files).then(function (response) {
            console.log('response from download');
            console.log(response.data);
            alfrescoDownloadService.downloadZipFile(response.data.downloadNodeRef);
        });

    };
}