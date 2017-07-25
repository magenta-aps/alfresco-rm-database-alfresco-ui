angular
    .module('openDeskApp.declaration')
    .controller('PatientInfoToolbarController', PatientInfoToolbarController);

function PatientInfoToolbarController($scope, $mdDialog, $state, $stateParams, $mdToast, $transitions, declarationService, filterService, authService) {

    $scope.declarationService = declarationService;
    $scope.editMode = false;
    $scope.caseTitle = '';
    $scope.currentCase;
    $scope.closeCaseParams = {
        closed: null,
        reason: null,
        sentTo: null,
    };
    $scope.editor = {};
    $scope.canCurrentlyEdit = true;
    $scope.dropdownOptions;

    var clickedSave = false;

    var currentUser = authService.getUserInfo().user;

    $scope.$watch('declarationService.getCaseTitle()', function (newVal) {
        $scope.caseTitle = newVal;
    });

    $scope.$watch('declarationService.getAllDropdownOptions()', function (newVal) {
        $scope.dropdownOptions = newVal;
    });

    $scope.$watch('declarationService.getCurrentCase()', function (newVal) {
        $scope.currentCase = newVal;

        if(newVal.hasOwnProperty('locked4editBy') && newVal.locked4editBy != "null") {
            $scope.editor = angular.fromJson(newVal.locked4editBy);

            if($scope.editor.hasOwnProperty('userName')) {
                $scope.canCurrentlyEdit = $scope.editor.userName == currentUser.userName ? true : false;
            }
            else {
                $scope.canCurrentlyEdit = true;
            }

        if ($scope.editor.userName == currentUser.userName) {
            $scope.editMode = true;
            declarationService.forceEdit(true);
            $state.go('declaration.show.patientdata.edit');
        }
        }
    });

    $scope.toggleEdit = function () {
        $scope.editMode = !$scope.editMode;
        declarationService.toggleEdit();

        if ($scope.editMode) {
            $state.go('declaration.show.patientdata.edit');
            lockCase(true);
        } else {
            $state.go('declaration.show.patientdata');
            //lockCase(false);

            $mdToast.show(
                $mdToast.simple()
                .textContent('Ændringerne er gemt')
                .position('top right')
                .hideDelay(3000)
            );
        }
    }

    $scope.saveEdit = function () {
        clickedSave = true;
        var newCase = declarationService.getNewCaseInfo();
        newCase.fullName = newCase.firstName + ' ' + newCase.lastName;
        newCase.locked4edit = false;
        newCase.locked4editBy = {};
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

    $scope.closeCase = function () {
        $scope.currentCase.locked4edit = false;
        $scope.currentCase.locked4editBy = {};
        $scope.currentCase.closed = $scope.closeCaseParams.closed;
        $scope.currentCase.reason = $scope.closeCaseParams.reason;
        $scope.currentCase.sentTo = $scope.closeCaseParams.sentTo;
        
        declarationService.updateCase($scope.currentCase);
        $mdDialog.cancel();
    }

    $scope.back = function () {
        $state.go('declaration');
    }

    function lockCase(lock) {
        var locked = {
            'node-uuid': $scope.currentCase['node-uuid'],
            'locked4edit': lock,
            'locked4editBy': lock ? currentUser : {}
        }
        declarationService.updateCase(locked).then(function (response) {
            console.log(response);
        });
        console.log('locked: ' + lock);
    }

    $transitions.onStart({
        from: 'declaration.show.patientdata.edit'
    }, function (trans) {

        if ($scope.editMode && !clickedSave) {
            $scope.editMode = false;
            declarationService.forceEdit(false);
            lockCase(false);
        }
    });

    $scope.dropdownFilter = function(array, query, filters) {
        return filterService.dropdownFilter(array, query, filters);
    }

    $scope.cancel = function() {
        $mdDialog.cancel();
    }
}