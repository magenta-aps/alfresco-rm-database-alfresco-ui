angular
    .module('openDeskApp.declaration')
    .controller('ListController', ListController);

function ListController($scope, $state, $stateParams, listService, declarationService) {

    $scope.listTitle = $stateParams.listTitle;
    $scope.listContent = [];
    var content = declarationService.getDropdownOptions($stateParams.listData);

    content.forEach(function(elem,key) {
        $scope.listContent.push({title: elem, selected: false});
        console.log(elem + key);
    }, this);

    $scope.query = {
        order: 'title'
    }

    $scope.$watch('listContent', function (newVal) {
        var count = 0;
        newVal.forEach(function (element) {
            count += element.selected ? 1 : 0;
        }, this);
        console.log(count);
    }, true);
}