angular
    .module('openDeskApp.declaration')
    .controller('DeclarationController', DeclarationController);

function DeclarationController($scope, $state, $stateParams, declarationService) {

    //sets the margin to the width of sidenav
    var sidebar = $(".md-sidenav-left");
    $(".od-info-declarations").css("margin-left", sidebar.width() + "px");

    $scope.case = "tom";

    $scope.dropdownOptions;

    function loadCase(caseid) {
        if (caseid) {
            declarationService.getCase(caseid).then(function (response) {
                declarationService.setCurrentCase(response[0]);
                console.log('case loaded');
                console.log(response[0]);
            });
        }
    }
    loadCase($stateParams.caseid);

    $scope.dropdownOptions = declarationService.getAllDropdownOptions();

    $scope.viewDocuments = function () {
        $state.go('declaration.show.documents');
    }

    $scope.editDocuments = function () {
        $state.go('declaration.show.documents.edit');
    }

    $scope.viewPatientData = function () {
        $state.go('declaration.show.patientdata');
    }

}