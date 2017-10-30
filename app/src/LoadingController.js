'use strict';

angular
    .module('openDeskApp')
    .controller('LoadingController', LoadingController);

function LoadingController($scope,loadingService) {

    $scope.loadingService = loadingService;

    $scope.isLoading = true;


    $scope.$watch('loadingService.isLoading()', function (newVal) {
        $scope.isLoading = newVal;
    });
}



angular.module('openDeskApp').factory('loadingService', function () {

    var loading = true;

    return {
        setLoading: function(state) {
            loading = state;
        },

        isLoading: function() {
            return loading;
        },


    };
});
