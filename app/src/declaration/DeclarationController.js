angular
    .module('openDeskApp.declaration')
    .controller('DeclarationController', DeclarationController);

function DeclarationController($scope, $state, $stateParams, declarationService, documentToolbarService, patientInfoToolbarService) {
    var vm = this;

    $scope.toolbarService = documentToolbarService;
    $scope.patientToolbarService = patientInfoToolbarService;

    $scope.contents = [];
    $scope.currentCaseNumber = "";

    $scope.case = {};

    $scope.editPatientData = false;
    $scope.tableView = false;

    $scope.$watch('toolbarService.getDocumentView()', function (newVal) {
        $scope.tableView = newVal;
    });

    $scope.$watch('patientToolbarService.isEditing()', function (newVal) {
        $scope.editPatientData = newVal;
    });

    function loadCase() {

        if ($scope.currentCaseNumber != "") {

            declarationService.getCase($scope.currentCaseNumber).then(function (response) {
                $scope.case = response[0];
                vm.loadFiles($scope.case["node-uuid"]);
            });
        }
    }

    $scope.getCase = function (number) {
        $scope.currentCaseNumber = number;
        loadCase();
    };

    $scope.viewDocuments = function () {
        $state.go('declaration.documents');
    }

    $scope.editDocuments = function () {
        $state.go('declaration.documents.edit');
    }

    $scope.viewPatientData = function () {
        $state.go('declaration.patientdata');
    }

    vm.loadFiles = function (node) {
        declarationService.getContents(node).then(function (response) {
            $scope.contents = response;
            console.log(response)
            //$scope.contents.forEach(function (contentTypeList) {
            //    $scope.contentLength += contentTypeList.length;
            //    //vm.addThumbnailUrl(contentTypeList);
            //});
        });
    };


}