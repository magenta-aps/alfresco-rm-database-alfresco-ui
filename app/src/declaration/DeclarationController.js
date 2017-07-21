angular
    .module('openDeskApp.declaration')
    .controller('DeclarationController', DeclarationController);

function DeclarationController($scope, $state, $stateParams, declarationService) {

    //sets the margin to the width of sidenav
    var sidebar = $(".md-sidenav-left");
    $(".od-info-declarations").css("margin-left", sidebar.width() + "px");

    $scope.case = {};
    $scope.bidiagnoses = [{
        id: 'bidiagnosis1'
    }];
    $scope.dropdownOptions = declarationService.getAllDropdownOptions();

    function loadCase(caseid) {
        if (caseid) {
            declarationService.getCase(caseid).then(function (response) {

                    $scope.case = response;
                    console.log('case loaded');
                    console.log($scope.case);

                    if (response.hasOwnProperty('bidiagnoses')) {
                        $scope.bidiagnoses = [];

                        Object.keys(response.bidiagnoses).forEach(function (elem) {
                            $scope.bidiagnoses.push({
                                id: elem
                            });
                        });
                    }

                    var creationDate = new Date(response.creationDate);
                    var observationDate = new Date(response.observationDate);
                    var declarationDate = new Date(response.declarationDate);

                    $scope.passiveWait = Math.ceil((observationDate - creationDate) / 1000 / 60 / 60 / 24);
                    $scope.activeWait = Math.ceil((declarationDate - observationDate) / 1000 / 60 / 60 / 24);
                    $scope.totalWait = Math.ceil((declarationDate - creationDate) / 1000 / 60 / 60 / 24);
                
            },function(error) {
                console.log('ikke sat endnu');
                console.log(error);
                $scope.case = declarationService.getCurrentCase();
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

    $scope.addNewBidiagnosis = function () {
        var newItemNo = $scope.bidiagnoses.length + 1;
        $scope.bidiagnoses.push({
            'id': 'bidiagnosis' + newItemNo
        });
    };

    $scope.isNumber = function (number) {
        return isNaN(number) ? false : true;
    }

}