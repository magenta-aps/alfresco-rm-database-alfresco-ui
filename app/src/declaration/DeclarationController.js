angular
    .module('openDeskApp.declaration')
    .controller('DeclarationController', DeclarationController);

function DeclarationController($scope, $state, $stateParams, declarationService) {

    //sets the margin to the width of sidenav
    var sidebar = $(".md-sidenav-left");
    $(".od-info-declarations").css("margin-left", sidebar.width()+"px");

<<<<<<< HEAD
    $scope.case = "tom";

    declarationService.getDropDownGroups();

    function loadCase() {

        if ($scope.currentCaseNumber != "") {

            declarationService.getCase($scope.currentCaseNumber).then(function (response) {
                $scope.case = response[0];
                vm.loadFiles($scope.case["node-uuid"]);
=======
    function loadCase(caseid) {
        if (caseid) {
            declarationService.getCase(caseid).then(function (response) {
                declarationService.setCurrentCase(response[0]);
                console.log('case loaded');
>>>>>>> feature/frontend
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

}