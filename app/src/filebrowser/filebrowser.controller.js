'use strict';

angular
    .module('openDeskApp.filebrowser')
    .controller('FilebrowserController', FilebrowserController);

function FilebrowserController($state, $stateParams, $scope, $rootScope, $mdDialog, Upload, siteService, fileUtilsService,
    filebrowserService, alfrescoDownloadService, documentPreviewService, documentService, alfrescoNodeUtils) {

    var vm = this;
    var documentNodeRef = "";
    var folderNodeRef = "";

    vm.cancelDialog = cancelDialog;
    vm.contentList = [];
    vm.contentListLength = 0;
    vm.deleteContentDialog = deleteContentDialog;
    vm.deleteFile = deleteFile;
    vm.documentTemplates = {};
    vm.error = false;
    vm.getLink = getLink;
    vm.isLoading = true;
    vm.uploading = false;
    vm.uploadDocumentsDialog = uploadDocumentsDialog;

    //de her er dublikeret i document.controller!
    $scope.downloadDocument = downloadDocument;
    $scope.previewDocument = previewDocument;
    $scope.goToLOEditPage = goToLOEditPage;

    $scope.filesToFilebrowser = null;

    $scope.$on('updateFilebrowser', function () {
        activate();
    });

    $scope.$watch('filesToFilebrowser', function () {
        if ($scope.filesToFilebrowser !== null) {
            $scope.files = $scope.filesToFilebrowser;
            vm.uploadFiles($scope.files);
        }
    });

    activate();

    function activate() {
        setFolderAndPermissions($stateParams.path);
    }

    function setFolderAndPermissions(path) {
        filebrowserService.getCompanyHome().then(function (val) {
            var companyHomeUri = alfrescoNodeUtils.processNodeRef(val).uri;
            filebrowserService.getNode(companyHomeUri, path).then(
                function (response) {
                    setFolder(response.metadata.parent.nodeRef);
                    //vm.permissions.canEdit = response.metadata.parent.permissions.userAccess.edit;
                },
                function (error) {
                    vm.isLoading = false;
                    vm.error = true;
                }
            );
        });
    }

    function setFolder(fNodeRef) {
        filebrowserService.setCurrentFolder(fNodeRef);
        folderNodeRef = fNodeRef;
        var folder = alfrescoNodeUtils.processNodeRef(folderNodeRef).id;
        loadContentList(folder);
    }

    function loadContentList(folderUUID) {
        filebrowserService.getContentList(folderUUID).then(function (contentList) {
                vm.contentList = contentList;

                angular.forEach(vm.contentList, function (contentTypeList) {
                    vm.contentListLength += contentTypeList.length;
                    processContent(contentTypeList);
                });
                // Compile paths for breadcrumb directive
                vm.paths = buildBreadCrumbPath();
                vm.isLoading = false;
            },
            function (error) {
                vm.isLoading = false;
                vm.error = true;
            }
        );
    }

    function processContent(content) {
        angular.forEach(content, function (item) {
            item.thumbNailURL = fileUtilsService.getFileIconByMimetype(item.mimeType, 24);
            item.loolEditable = documentService.isLoolEditable(item.mimeType);
            item.msOfficeEditable = documentService.isMsOfficeEditable(item.mimeType);
        });
    }

    function getLink(content) {
        if (content.contentType === 'cmis:document') {
            return 'document({doc: "' + content.shortRef + '"})';
        }
        if (content.contentType === 'cmis:folder') {
            if ($scope.isSite)
                return 'project.filebrowser({projekt: "' + $stateParams.projekt +
                    '", path: "' + $stateParams.path + '/' + content.name + '"})';
            else
                return 'systemsettings.filebrowser({path: "' + $stateParams.path + '/' + content.name + '"})';
        }
        if (content.contentType === 'cmis:link') {
            return 'project({projekt: "' + content.destination_link + '"})';
        }
    }

    function buildBreadCrumbPath() {
        var homeLink;

        if ($scope.isSite)
            homeLink = 'project.filebrowser({projekt: "' + $stateParams.projekt + '", path: ""})';
        else
            homeLink = 'systemsettings.filebrowser({path: ""})';

        var paths = [{
            title: 'Home',
            link: homeLink
        }];

        if ($stateParams.path !== undefined) {
            var pathArr = $stateParams.path.split('/');
            var pathLink = '/';
            for (var a in pathArr) {
                if (pathArr[a] !== '') {
                    var link;
                    if ($scope.isSite)
                        link = 'project.filebrowser({projekt: "' + $stateParams.projekt +
                        '", path: "' + pathLink + pathArr[a] + '"})';
                    else
                        link = 'systemsettings.filebrowser({path: "' + pathLink + pathArr[a] + '"})';
                    paths.push({
                        title: pathArr[a],
                        link: link
                    });
                    pathLink = pathLink + pathArr[a] + '/';
                }
            }
        }
        return paths;
    }

    // Dialogs

    function cancelDialog() {
        $rootScope.$broadcast('updateFilebrowser');
        $mdDialog.cancel();
        $scope.files = [];
    }

    // Documents

    function uploadDocumentsDialog() {
        $mdDialog.show({
            templateUrl: 'app/src/filebrowser/upload/upload.view.html',
            controller: 'UploadController',
            controllerAs: 'vm',
            clickOutsideToClose: true
        });
    }

    function downloadDocument(nodeRef, name) {
        alfrescoDownloadService.downloadFile(nodeRef, name);
    }


    function previewDocument(nodeRef) {
        documentPreviewService.previewDocument(nodeRef);
    }


    function goToLOEditPage(nodeRef, fileName) {
        $state.go('lool', {
            'nodeRef': nodeRef,
            'fileName': fileName
        });
    }

    function deleteContentDialog(event, content) {
        $scope.content = content;
        $mdDialog.show({
            templateUrl: 'app/src/filebrowser/delete/deleteContent.view.html',
            targetEvent: event,
            scope: $scope, // use parent scope in template
            preserveScope: true, // do not forget this if use parent scope
            clickOutsideToClose: true
        });
    }

    function deleteFile(nodeRef) {
        documentService.deleteFile(nodeRef).then(function (response) {
            cancelDialog();
        });
    }
}