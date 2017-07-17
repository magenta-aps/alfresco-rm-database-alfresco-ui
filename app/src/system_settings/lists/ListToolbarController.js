angular
    .module('openDeskApp.declaration')
    .controller('ListToolbarController', ListToolbarController);

function ListToolbarController($scope, $mdDialog) {

    $scope.addNewDialog = function (event) {
        $mdDialog.show({
            controller: 'ListActionController',
            controllerAs: 'vm',
            templateUrl: 'app/src/system_settings/lists/view/list-create.html',
            parent: angular.element(document.body),
            targetEvent: event,
            scope: $scope, // use parent scope in template
            preserveScope: true, // do not forget this if use parent scope
            clickOutsideToClose: true
        });
    };
}