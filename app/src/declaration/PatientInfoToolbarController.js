angular
    .module('openDeskApp.declaration')
    .controller('PatientInfoToolbarController', PatientInfoToolbarController);

function PatientInfoToolbarController($scope, $mdDialog, $state, $stateParams, $mdToast, $transitions, declarationService, authService) {

    $scope.declarationService = declarationService;
    $scope.editMode = false;
    $scope.caseTitle = '';
    $scope.currentCase;
    $scope.editor = {};
    $scope.canCurrentlyEdit = true;

    var currentUser = authService.getUserInfo().user;

    $scope.$watch('declarationService.getCaseTitle()', function (newVal) {
        $scope.caseTitle = newVal;
    });

    $scope.$watch('declarationService.getCurrentCase()', function (newVal) {
        $scope.currentCase = newVal;
        if(newVal.hasOwnProperty('locked4editBy') && newVal.locked4editBy != "null") {
            $scope.editor = angular.fromJson(newVal.locked4editBy);

            if($scope.editor.hasOwnProperty('userName')) {
            $scope.canCurrentlyEdit = $scope.editor.userName == currentUser.userName ? true : false;
        }

        if ($scope.canCurrentlyEdit) {
            // $scope.editMode = true;
            // declarationService.toggleEdit();
            // $state.go('declaration.show.patientdata.edit');
        }
        }
    });

    $scope.toggleEdit = function () {
        $scope.editMode = !$scope.editMode;
        declarationService.toggleEdit();

        if ($scope.editMode) {
            $state.go('declaration.show.patientdata.edit');
        } else {
            $state.go('declaration.show.patientdata');

            $mdToast.show(
                $mdToast.simple()
                .textContent('Ændringerne er gemt')
                .position('top right')
                .hideDelay(3000)
            );
        }
    }

    $scope.saveEdit = function () {
        var newCase = declarationService.getNewCaseInfo();
        declarationService.updateCase(newCase).then(function (response) {
            console.log(response);
        });
    }

    $scope.lockCaseDialog = function () {
        $mdDialog.show({
            templateUrl: 'app/src/declaration/view/lock-dialog.html',
            parent: angular.element(document.body),
            targetEvent: event,
            scope: $scope, // use parent scope in template
            preserveScope: true, // do not forget this if use parent scope
            clickOutsideToClose: true
        });
    }

    $scope.lockCase = function () {
        $scope.currentCase.locked4edit = false;
        $scope.currentCase.locked4editBy = {}
        declarationService.updateCase($scope.currentCase);
        $mdDialog.cancel();
    }

    $scope.back = function () {
        $state.go('declaration');
    }

    $transitions.onStart({
        to: 'declaration.show.patientdata.edit'
    }, function () {
        var locked = {
            'node-uuid': $scope.currentCase['node-uuid'],
            'locked4edit': true,
            'locked4editBy': currentUser
        }
        declarationService.updateCase(locked);
    });

    $transitions.onStart({
        from: 'declaration.show.patientdata.edit'
    }, function (trans) {

        // var answer = confirm("Er du sikker på du vil forlade sagen uden at gemme?")
        // if (!answer) {
        //     return false;
        // }

        if ($scope.editMode) {
            $scope.editMode = false;
            declarationService.toggleEdit();
        }

        var locked = {
            'node-uuid': $scope.currentCase['node-uuid'],
            'locked4edit': false,
            'locked4editBy': {}
        }
        declarationService.updateCase(locked);
    });

    $scope.cancel = function() {
        $mdDialog.cancel();
    }
}