angular
    .module('openDeskApp.declaration')
    .controller('DiagnosisToolbarController', DiagnosisToolbarController);

function DiagnosisToolbarController($scope, $mdDialog) {

    $scope.addDiagnosisDialog = function (event) {
        $mdDialog.show({
            // controller: 'DocumentActionController',
            // controllerAs: 'vm',
            templateUrl: 'app/src/system_settings/diagnosis/view/diagnosis-create.html',
            parent: angular.element(document.body),
            targetEvent: event,
            scope: $scope, // use parent scope in template
            preserveScope: true, // do not forget this if use parent scope
            clickOutsideToClose: true
        });
    };
}