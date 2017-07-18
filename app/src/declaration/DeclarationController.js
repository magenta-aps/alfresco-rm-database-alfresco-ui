angular
    .module('openDeskApp.declaration')
    .controller('DeclarationController', DeclarationController);

function DeclarationController($scope, $state, $stateParams, declarationService) {

    //sets the margin to the width of sidenav
    var sidebar = $(".md-sidenav-left");
    $(".od-info-declarations").css("margin-left", sidebar.width() + "px");

    $scope.case = "tom";

    $scope.dropdownOptions = declarationService.getAllDropdownOptions();

    function loadCase(caseid) {
        if (caseid) {
            declarationService.getCase(caseid).then(function (response) {
                declarationService.setCurrentCase(response[0]);
                $scope.case = response[0];
                console.log('case loaded');
                console.log(response[0]);

                var creationDate = new Date(response[0].creationDate);
                var observationDate = new Date(response[0].observationDate);
                var declarationDate = new Date(response[0].declarationDate);

                $scope.passiveWait = (observationDate - creationDate) / 1000 / 60 / 60 / 24;
                $scope.activeWait = (declarationDate - observationDate) / 1000 / 60 / 60 / 24;
                $scope.totalWait = (declarationDate - creationDate) / 1000 / 60 / 60 / 24;
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

    $scope.isNumber = function (number) {
        return isNaN(number) ? false : true;
    }

}