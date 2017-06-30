angular
    .module('openDeskApp.declaration')
    .controller('DeclarationController', DeclarationController);

function DeclarationController($scope, $state, $stateParams, declarationService, documentToolbarService) {
    var vm = this;

    $scope.toolbarService = documentToolbarService;
    $scope.declarationService = declarationService;

    $scope.contents = [];

    $scope.case = {};

    $scope.editPatientData = false;
    $scope.tableView = false;

    //sets the margin to the width of sidenav
    var sidebar = $(".md-sidenav-left");
    $(".od-info-declarations").css("margin-left", sidebar.width()+"px");

    $scope.$watch('toolbarService.getDocumentView()', function (newVal) {
        $scope.tableView = newVal;
    });

    $scope.$watch('declarationService.isEditing()', function (newVal) {
        $scope.editPatientData = newVal;
    });

    $scope.$watch('case', function (newVal) {
        declarationService.updateNewCase(newVal);
    }, true);

    function loadCase(caseid) {
        if (caseid) {
            declarationService.getCase(caseid).then(function (response) {
                $scope.case = response[0];
                vm.loadFiles($scope.case["node-uuid"]);
            });
        }
    }
    loadCase($stateParams.caseid);

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