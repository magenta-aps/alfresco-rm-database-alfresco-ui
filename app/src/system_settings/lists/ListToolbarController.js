angular
    .module('openDeskApp.declaration')
    .controller('ListToolbarController', ListToolbarController);

function ListToolbarController($scope, $mdDialog, $transitions, propertyService) {

    $scope.propertyService = propertyService;

    $scope.count = 0;

    $scope.isEditing = false;


    $scope.$watch('propertyService.getSelectedContent()', function (newVal) {
        $scope.count = newVal.length;
    }, true);

    $scope.toggleEdit = function () {
        $scope.isEditing = !$scope.isEditing;
        propertyService.setEdit($scope.isEditing);
    }

    $scope.saveChanges = function() {
        propertyService.saveChanges();
    }

    $scope.addNewDialog = function (event) {
        $mdDialog.show({
            controller: 'ListActionController',
            controllerAs: 'vm',
            templateUrl: 'app/src/system_settings/lists/view/list-create.html',
            parent: angular.element(document.body),
            targetEvent: event,
            locals: {selectedForRename: ''},
            scope: $scope, // use parent scope in template
            preserveScope: true, // do not forget this if use parent scope
            clickOutsideToClose: true
        });
    };

    $scope.deleteDialog = function (event) {
        $mdDialog.show({
            controller: 'ListActionController',
            controllerAs: 'vm',
            templateUrl: 'app/src/system_settings/lists/view/list-delete.html',
            parent: angular.element(document.body),
            targetEvent: event,
            locals: {selectedForRename: ''},
            scope: $scope, // use parent scope in template
            preserveScope: true, // do not forget this if use parent scope
            clickOutsideToClose: true
        });
    };

    $transitions.onStart({
        from: 'administration.systemsettings.*'
    }, function (trans) {

        if ($scope.isEditing) {
            $scope.isEditing = false;
            propertyService.setEdit(false);
        }
    });
}