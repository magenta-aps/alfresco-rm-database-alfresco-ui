'use strict';

angular
    .module('openDeskApp.declaration')
    .controller('DeclarationController', DeclarationController);

function DeclarationController($scope, $state, $stateParams, entryService, propertyService) {

    var vm = this;

    //sets the margin to the width of sidenav
    var sidebar = $(".md-sidenav-left");
    $(".od-info-declarations").css("margin-left", sidebar.width() + "px");

    $scope.case = {};

    $scope.propertyValues = propertyService.getAllPropertyValues();
    vm.viewDocuments = viewDocuments;
    vm.viewPatientData = viewPatientData;
    vm.isNumber = isNumber;
    
    activate();

    function activate() {
        if ($stateParams.caseid) {
            entryService.getEntry($stateParams.caseid).then(function (response) {
                $scope.case = response;
            }, function (error) {
                $scope.case = entryService.getCurrentCase();
            });
        }
    }

    
    function viewDocuments() {
        $state.go('declaration.show.documents');
    }
    
    function viewPatientData() {
        $state.go('declaration.show.patientdata');
    }

    
    function isNumber(number) {
        return isNaN(number) ? false : true;
    }
}