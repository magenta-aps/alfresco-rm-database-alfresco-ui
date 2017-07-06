angular
    .module('openDeskApp.declaration')
    .controller('PractitionerController', PractitionerController);

function PractitionerController($scope, $state, $stateParams, declarationService) {

    // function loadCase(caseid) {
    //     if (caseid) {
    //         declarationService.getCase(caseid).then(function (response) {
    //             declarationService.setCurrentCase(response[0]);
    //             console.log('case loaded');
    //         });
    //     }
    // }
    // loadCase($stateParams.caseid);

    // $scope.viewDocuments = function () {
    //     $state.go('declaration.show.documents');
    // }

    // $scope.editDocuments = function () {
    //     $state.go('declaration.show.documents.edit');
    // }

    // $scope.viewPatientData = function () {
    //     $state.go('declaration.show.patientdata');
    // }

}