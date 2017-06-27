angular
    .module('openDeskApp.declaration')
    .controller('DeclarationController', DeclarationController);

function DeclarationController($scope, authService, declarationService) {
    var vm = this;


    $scope.currentCaseNumber = "";

    $scope.case = "tom";

    vm.newDeclaration = function newDeclaration() {
        alert("test");
    }

    vm.test = function test() {
        alert("test");
    }



    function loadCase() {

        if ($scope.currentCaseNumber != "") {

            declarationService.getCase($scope.currentCaseNumber).then(function (response) {
                $scope.case = response[0];
            });

        }
    }

    $scope.getCase = function (number) {
        console.log("number")
        console.log(number)
        $scope.currentCaseNumber = number;
        loadCase();

    };


}