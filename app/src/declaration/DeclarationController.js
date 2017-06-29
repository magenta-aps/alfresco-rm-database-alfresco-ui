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

    $scope.$watch('case', function (newVal, oldVal) {
        // console.log(newVal);
        declarationService.updateNewCase(newVal);
    }, true);

    function loadCase() {

        if ($scope.currentCaseNumber != "") {
            declarationService.getCase($scope.currentCaseNumber).then(function (response) {
                $scope.case = response[0];
                vm.loadFiles($scope.case["node-uuid"]);
            });
        }
    }

    function getCase(number) {
        $scope.currentCaseNumber = number;
        loadCase();
    };
    getCase($stateParams.caseid);

    $scope.viewDocuments = function () {
        $state.go('declaration.show.documents');
    }

    $scope.editDocuments = function () {
        $state.go('declaration.show.documents.edit');
    }

    $scope.viewPatientData = function () {
        $state.go('declaration.show.patientdata');
    }

    vm.loadFiles = function (node) {
        declarationService.getContents(node).then(function (response) {
            $scope.contents = response;
            console.log(response)
        });
    };


}