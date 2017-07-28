angular
    .module('openDeskApp.declaration')
    .controller('ListController', ListController);

function ListController($scope, $state, $stateParams, $mdDialog, propertyService) {

    $scope.propertyService = propertyService;

    $scope.isEditing = false;
    $scope.listTitle = $stateParams.listTitle;
    $scope.listContent = propertyService.getPropertyContent($stateParams.listData);

    propertyService.setPropertyName($stateParams.listData);

    $scope.query = {
        order: 'title'
    }

    $scope.$watch('propertyService.isEditing()', function (newVal) {
        $scope.isEditing = newVal;
    });

    $scope.$watch('listContent', function (newVal) {
        var count = 0;
        var selectedContent = [];
        newVal.forEach(function (element) {
            count += element.selected ? 1 : 0;
            if(element.selected) {
                selectedContent.push(element);
            }
        }, this);
        propertyService.updateCount(count);
        propertyService.updateSelectedContent(selectedContent);
        propertyService.updateContent(newVal);
    }, true);


    $scope.renameDialog = function (value) {
        $mdDialog.show({
            controller: 'ListActionController',
            controllerAs: 'vm',
            templateUrl: 'app/src/system_settings/lists/view/list-rename.html',
            parent: angular.element(document.body),
            locals: {selectedForRename: value},
            scope: $scope, // use parent scope in template
            preserveScope: true, // do not forget this if use parent scope
            clickOutsideToClose: true
        });
    };
}