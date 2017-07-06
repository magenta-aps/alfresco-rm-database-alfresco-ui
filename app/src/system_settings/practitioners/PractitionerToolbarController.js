angular
    .module('openDeskApp.declaration')
    .controller('PractitionerToolbarController', PractitionerToolbarController);

function PractitionerToolbarController($scope, $mdDialog) {

    $scope.addPractitionerDialog = function (event) {
        $mdDialog.show({
            // controller: 'DocumentActionController',
            // controllerAs: 'vm',
            templateUrl: 'app/src/system_settings/practitioners/view/practitioner-create.html',
            parent: angular.element(document.body),
            targetEvent: event,
            scope: $scope, // use parent scope in template
            preserveScope: true, // do not forget this if use parent scope
            clickOutsideToClose: true
        });
    };
}