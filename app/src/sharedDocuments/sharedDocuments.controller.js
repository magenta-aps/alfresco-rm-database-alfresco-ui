'use strict';

angular
  .module('oda.sharedDocuments')
  .controller('SharedDocumentsController', SharedDocumentsController);

function SharedDocumentsController($scope, $stateParams, $translate, ContentService, HeaderService, $http) {
    var vm = this;

    $scope.folderUuid = [];

    HeaderService.setTitle($translate.instant('DOCUMENT.DOCUMENTS'))
    activate();

    function activate() {
        $scope.isLoading = true;


        getCurrentUserType();


        function getCurrentUserType() {
            return $http.get('/alfresco/s/updateUser?userName=' + "CURRENT_USER" + "&method=getUserType")
                .then(function (response) {

                    var buaUser = response.data.result;

                    if (buaUser.bua) {

                        ContentService.getSharedFolderForBua()
                            .then(function (response) {
                                $scope.folderUuid = response;
                            })
                    } else {

                        ContentService.getFolderNodeRefFromPath($stateParams.path)
                            .then(function (response) {
                                $scope.folderUuid = response;
                            })
                    }

                })
        }

    }
}
