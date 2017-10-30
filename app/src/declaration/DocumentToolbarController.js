'use strict';

angular
    .module('openDeskApp.declaration')
    .controller('DocumentToolbarController', DocumentToolbarController);

function DocumentToolbarController($scope, $mdDialog, $interval, $mdToast, entryService, documentToolbarService, documentService,
    preferenceService, authService, documentPreviewService, alfrescoDownloadService) {

    $scope.toggleIcon = 'list';

    $scope.case = [];

    $scope.toggleDocumentView = toggleDocumentView;
    $scope.uploadDocumentsDialog = uploadDocumentsDialog;
    $scope.deleteDocumentsDialog = deleteDocumentsDialog;
    $scope.downloadDocuments = downloadDocuments;

    var currentUser = authService.getUserInfo().user;

    preferenceService.getPreferences(currentUser.userName, 'dk.magenta.sites.retspsyk.tableView').then(function (response) {
        $scope.toggleIcon = response['dk.magenta.sites.retspsyk.tableView'] == 'true' ? 'view_module' : 'list';
    });

    $scope.entryService = entryService;

    $scope.$watch('entryService.getCurrentCase()', function (newVal) {
        console.log(newVal);
        $scope.case = newVal;
    });
    
    function toggleDocumentView() {
        documentToolbarService.toggleDocumentView();
        $scope.toggleIcon = documentToolbarService.getToggleIcon();
    }

    
    function uploadDocumentsDialog(event) {
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
    }

    
    function deleteDocumentsDialog(event) {
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

    function downloadDocuments(event) {
        console.log('download documents');

        var files = documentService.getSelectedFiles();
        var delay = 3000;
        var toastLabel = 'Henter filer...';

        if (files.length == 1) {
            files.forEach(function (file) {
                toastLabel = 'Henter ' + file.name;
                documentPreviewService.previewDocumentPlugin(file.nodeRef).then(function (plugin) {
                    alfrescoDownloadService.downloadFile(plugin.nodeRef, plugin.fileName, true);
                });
            });
        } else {
            documentService.downloadFiles(files).then(function (response) {
                var download = $interval(function () {
                    documentService.getDownloadStatus(response.data.downloadNodeRef).then(function (res) {
                        delay += 1000;
                        if (res == 'DONE') {
                            alfrescoDownloadService.downloadFile(response.data.downloadNodeRef, $scope.case.caseNumber, false);
                            $interval.cancel(download);
                        }
                    });
                }, 1000, 20);
            });
        }

        $mdToast.show(
            $mdToast.simple()
            .textContent(toastLabel)
            .position('top right')
            .hideDelay(delay)
        );
    }
}