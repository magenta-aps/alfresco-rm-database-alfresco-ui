'use strict';

angular.module('openDeskApp.documents')
    .controller('DocumentController', DocumentController);

function DocumentController($scope, $translate, documentService, $stateParams, $location, $state,
    documentPreviewService, alfrescoDownloadService, browserService, $mdDialog, $window) {

    var vm = this;

    vm.doc = [];
    vm.plugin = [];
    vm.paths = [];
    vm.canEdit = false;
    vm.browser = {};

    vm.updatePreview = loadPreview;
    vm.selectFile = selectFile;
    vm.cancelDialog = cancelDialog;
    vm.goBack = goBack;
    vm.goToLOEditPage = goToLOEditPage;
    vm.downloadDocument = downloadDocument;

    var selectedDocumentNode = $stateParams.doc !== undefined ? $stateParams.doc : $stateParams.nodeRef.split('/')[3];
    var parentDocumentNode = $location.search().parent !== undefined ? $location.search().parent : selectedDocumentNode;
    var docHasParent = $location.search().parent !== undefined;
    var firstDocumentNode = "";

    angular.element($window).bind('resize', function () {

        setPDFViewerHeight();
        // manuall $digest required as resize event
        // is outside of angular
        $scope.$digest();
    });

    activate();

    function activate() {
        documentService.getEditPermission(parentDocumentNode).then(function (val) {
            vm.canEdit = val;
        });

        setPDFViewerHeight();
        loadPreview();
        getDocument();
    }

    function cancelDialog() {
        $mdDialog.cancel();
    }

    function goBack() {
        window.history.go(-1);

    }

    function setPDFViewerHeight() {
        var height = $(window).height() - 150 - $("header").outerHeight();

        $scope.iframeStyle = {
            "height": height + 'px',
            "width": "100%"
        };
    }

    function selectFile(event) {
        var file = event.target.value;
        var fileName = file.replace(/^C:\\fakepath\\/, "");
        document.getElementById("uploadFile").innerHTML = fileName;
    }


    function getDocument() {
        documentService.getDocument(parentDocumentNode).then(function (response) {

            vm.doc = response.item;
            vm.loolEditable = documentService.isLoolEditable(vm.doc.node.mimetype);
            vm.msOfficeEditable = documentService.isMsOfficeEditable(vm.doc.node.mimetype);

            vm.docMetadata = response.metadata;

            // Compile paths for breadcrumb directive
            vm.paths = buildBreadCrumbPath(response);

            browserService.setTitle(response.item.node.properties["cm:name"]);

        });
    }

    function buildBreadCrumbPath(response) {
        var paths = [{
            title: response.item.location.siteTitle,
            link: 'project.filebrowser({projekt: "' + response.item.location.site.name + '", path: ""})'
        }];
        var pathArr = response.item.location.path.split('/');
        var pathLink = '/';
        for (var a in pathArr) {
            if (pathArr[a] !== '') {
                var link;
                if (response.item.location.site === "") {
                    link = 'administration.document_templates({path: "' + pathLink + pathArr[a] + '"})';
                } else {
                    link = 'project.filebrowser({projekt: "' + response.item.location.site.name +
                        '", path: "' + pathLink + pathArr[a] + '"})';
                }
                paths.push({
                    title: pathArr[a],
                    link: link
                });
                pathLink = pathLink + pathArr[a] + '/';
            }
        }
        paths.push({
            title: response.item.location.file,
            link: response.item.location.path
        });
        return paths;
    }

    function loadPreview() {
        console.log('load preview');
        // todo check if not ok type like pdf, jpg and png - then skip this step
        if (docHasParent) {
            vm.store = 'versionStore://version2Store/';

            documentService.createVersionThumbnail(parentDocumentNode, selectedDocumentNode).then(function (response) {
                documentPreviewService.previewDocumentPlugin(response.data[0].nodeRef).then(function (plugin) {
                    vm.plugin = plugin;
                    $scope.config = plugin;
                    $scope.viewerTemplateUrl = documentPreviewService.templatesUrl + plugin.templateUrl;
                    $scope.download = function () {
                        // todo fix the download url to download from version/version2store
                        alfrescoDownloadService.downloadFile($scope.config.nodeRef, $scope.config.fileName);
                    };

                    if (plugin.initScope) {
                        plugin.initScope($scope);
                    }

                    // delete the temporary node
                    documentService.cleanupThumbnail(response.data[0].nodeRef);

                });
            });

        } else {
            vm.store = 'workspace://SpacesStore/';
            documentPreviewService.previewDocumentPlugin(vm.store + $stateParams.doc).then(function (plugin) {

                vm.plugin = plugin;
                $scope.config = plugin;
                $scope.viewerTemplateUrl = documentPreviewService.templatesUrl + plugin.templateUrl;
                $scope.download = function () {
                    alfrescoDownloadService.downloadFile($scope.config.nodeRef, $scope.config.fileName);
                };

                if (plugin.initScope) {
                    plugin.initScope($scope);
                }

            });
        }
    }

    //Goes to the libreOffice online edit page
    function goToLOEditPage() {
        var ref = $stateParams.doc;
        var isFirstInHistory = ref === firstDocumentNode;
        if (docHasParent && !isFirstInHistory) {
            //first promote doc to latest version
            confirmLoolEditDocDialog();
        } else {
            $state.go('lool', {
                'nodeRef': vm.doc.node.nodeRef
            });
        }
    }

    function downloadDocument() {
        var versionRef = vm.store + $stateParams.doc;
        alfrescoDownloadService.downloadFile(versionRef, vm.doc.location.file);
    }
}