angular
    .module('openDeskApp.declaration')
    .controller('DeclarationController', DeclarationController);

function DeclarationController($scope, declarationService) {
    var vm = this;

    $scope.contents = [];
    $scope.currentCaseNumber = "";

    $scope.case = "tom";

    declarationService.getDropDownGroups();

    function loadCase() {

        if ($scope.currentCaseNumber != "") {

            declarationService.getCase($scope.currentCaseNumber).then(function (response) {
                $scope.case = response[0];
                vm.loadFiles($scope.case["node-uuid"]);
            });
        }
    }

    $scope.getCase = function (number) {
        $scope.currentCaseNumber = number;
        loadCase();
    };

    vm.loadFiles = function (node) {
        declarationService.getContents(node).then(function (response) {
            $scope.contents = response;
            console.log(response)
            //$scope.contents.forEach(function (contentTypeList) {
            //    $scope.contentLength += contentTypeList.length;
            //    //vm.addThumbnailUrl(contentTypeList);
            //});
        });
    };


}