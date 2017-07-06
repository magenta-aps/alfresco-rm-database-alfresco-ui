angular
    .module('openDeskApp.declaration')
    .controller('EthnicityToolbarController', EthnicityToolbarController);

function EthnicityToolbarController($scope, $mdDialog) {

    $scope.addEthnicityDialog = function (event) {
        $mdDialog.show({
            // controller: 'DocumentActionController',
            // controllerAs: 'vm',
            templateUrl: 'app/src/system_settings/ethnicities/view/ethnicity-create.html',
            parent: angular.element(document.body),
            targetEvent: event,
            scope: $scope, // use parent scope in template
            preserveScope: true, // do not forget this if use parent scope
            clickOutsideToClose: true
        });
    };
}