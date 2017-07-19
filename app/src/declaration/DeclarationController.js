angular
    .module('openDeskApp.declaration')
    .controller('DeclarationController', DeclarationController);

function DeclarationController($scope, $state, $stateParams, declarationService) {

    //sets the margin to the width of sidenav
    var sidebar = $(".md-sidenav-left");
    $(".od-info-declarations").css("margin-left", sidebar.width() + "px");

    $scope.case = {};

    $scope.bidiagnoses = [{id: 'bidiagnosis1'}];

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

                $scope.passiveWait = Math.ceil((observationDate - creationDate) / 1000 / 60 / 60 / 24);
                $scope.activeWait = Math.ceil((declarationDate - observationDate) / 1000 / 60 / 60 / 24);
                $scope.totalWait = Math.ceil((declarationDate - creationDate) / 1000 / 60 / 60 / 24);
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

    $scope.addNewBidiagnosis = function() {
        var newItemNo = $scope.bidiagnoses.length+1;
        $scope.bidiagnoses.push({'id':'bidiagnosis'+newItemNo});
    };

    $scope.isNumber = function (number) {
        return isNaN(number) ? false : true;
    }

}