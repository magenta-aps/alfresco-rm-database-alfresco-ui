angular
    .module('openDeskApp.declaration')
    .controller('DeclarationController', DeclarationController);

function DeclarationController($scope, $state, $stateParams, entryService, propertyService) {

    $scope.entryService = entryService;
    //sets the margin to the width of sidenav
    var sidebar = $(".md-sidenav-left");
    $(".od-info-declarations").css("margin-left", sidebar.width() + "px");

    $scope.case = {};

    $scope.propertyValues = propertyService.getAllPropertyValues();

    function loadCase(caseid) {
        if (caseid) {
            entryService.getEntry(caseid).then(function (response) {
                $scope.case = response;
                console.log('case loaded');
                console.log($scope.case);
            }, function (error) {
                $scope.case = entryService.getCurrentCase();
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