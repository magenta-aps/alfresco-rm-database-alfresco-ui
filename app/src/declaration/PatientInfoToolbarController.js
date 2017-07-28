angular
    .module('openDeskApp.declaration')
    .controller('PatientInfoToolbarController', PatientInfoToolbarController);

function PatientInfoToolbarController($scope, $mdDialog, $state, $stateParams, $mdToast, $transitions, entryService, propertyService, filterService, authService) {

    $scope.entryService = entryService;
    $scope.propertyService = propertyService;
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
    $scope.propertyValues;

    var clickedSave = false;

    var currentUser = authService.getUserInfo().user;

    $scope.$watch('entryService.getCaseTitle()', function (newVal) {
        $scope.caseTitle = newVal;
    });

    $scope.$watch('propertyService.getAllPropertyValues()', function (newVal) {
        $scope.propertyValues = newVal;
    });

    $scope.$watch('entryService.getCurrentCase()', function (newVal) {
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
            entryService.toggleEdit(true);
            $state.go('declaration.show.patientdata.edit');
        }
        }
    });

    $scope.toggleEdit = function () {
        $scope.editMode = !$scope.editMode;
        entryService.toggleEdit($scope.editMode);

        if ($scope.editMode) {
            $state.go('declaration.show.patientdata.edit');
            lockCase(true);
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
        clickedSave = true;
        var newCase = entryService.getNewCaseInfo();
        newCase.fullName = newCase.firstName + ' ' + newCase.lastName;
        newCase.locked4edit = false;
        newCase.locked4editBy = {};
        entryService.updateEntry(newCase).then(function (response) {
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
        
        if($scope.closeCaseParams.closed == 'closed') {
            $scope.currentCase.closed = true;
        }
        if($scope.closeCaseParams.closed == 'no-declaration') {
            $scope.currentCase.closedWithoutDeclaration = true;
        }

        $scope.currentCase.closedWithoutDeclarationReason = $scope.closeCaseParams.reason;
        $scope.currentCase.closedWithoutDeclarationSentTo = $scope.closeCaseParams.sentTo;
        
        entryService.updateEntry($scope.currentCase);
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
        entryService.updateEntry(locked).then(function (response) {
            console.log(response);
        });
        console.log('locked: ' + lock);
    }

    $transitions.onStart({
        from: 'declaration.show.patientdata.edit'
    }, function (trans) {

        if ($scope.editMode && !clickedSave) {
            $scope.editMode = false;
            entryService.toggleEdit(false);
            lockCase(false);
        }
    });

    $scope.propertyFilter = function(array, query, filters) {
        return filterService.propertyFilter(array, query, filters);
    }

    $scope.cancel = function() {
        $mdDialog.cancel();
    }
}