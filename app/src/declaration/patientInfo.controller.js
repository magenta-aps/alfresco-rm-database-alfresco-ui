'use strict';

angular
	.module('openDeskApp.declaration')
	.controller('PatientInfoController', PatientInfoController);

function PatientInfoController($scope, $state, $stateParams, $mdDialog, DeclarationService, filterService, cprService, authService, Toast, HeaderService) {

	var vm = this;
	$scope.DeclarationService = DeclarationService;
	$scope.editPatientData = false;
	$scope.case;
	$scope.isLoading = false;

	$scope.propertyFilter = propertyFilter;
	$scope.addNewBidiagnosis = addNewBidiagnosis;
	vm.lookupCPR = lookupCPR;
	vm.isNumber = isNumber;
	vm.makeDeclarationDocument = makeDeclarationDocument;

	$scope.$on('$destroy', function () {
		if ($scope.case.locked4edit) {
			lockedForEdit(false);
		}
	});

	activated();

	function makeDeclarationDocument() {
		DeclarationService.makeDeclarationDocument($scope.case)
			.then(function (response) {
				$state.go('document', { doc: response.id });
			});
	}

	function canCreateDeclarationDocument(declaration) {
		var result = true;
		var props = ['referingAgency', 'declarationType', 'journalNumber']
		var missingProps = []


		if (declaration.declarationType == 'kendelse') {
			props.push('rulingDate')
			props.push('rulingCourt')

		}

		for (var p in props) {
			if (!declaration[props[p]]) {
				result = false;
				missingProps.push(props[p])
			}
		}
		return [result, missingProps]
	}

	function activated() {
		if (Object.keys($stateParams.caseData).length) {
			setEverything($stateParams.caseData)
		} else {
			DeclarationService.get($stateParams.caseid)
				.then(function (response) {
					setEverything(response)
				})
		}
	}

	function setEverything(response) {
		$scope.case = response;
		var bua = response.bua ? ' (BUA)' : '';
		HeaderService.resetActions();
		HeaderService.setTitle(response.firstName + ' ' + response.lastName + ' ( ' + response.caseNumber + ' / ' + response.cprNumber + ' )' + bua);
		HeaderService.setCaseId(response.caseNumber);
		HeaderService.setClosed(response.closed);


		var canCreate = canCreateDeclarationDocument(response)

		var declarationSettings = {
			disabled: !canCreate[0],
			tooltip: canCreate[1].length > 0 ? canCreate[1] : undefined
		}
		HeaderService.addAction('Opret erklæring', 'description', makeDeclarationDocument, false, declarationSettings)

		if (!response.closed) {
			HeaderService.addAction('DECLARATION.LOCK', 'lock', lockCaseDialog);
			HeaderService.addAction('COMMON.EDIT', 'edit', editCase);
		} else {
			if (HeaderService.canUnlockCases()) HeaderService.addAction('DECLARATION.UNLOCK', 'lock_open', unlockCase);
		}
	}

	function propertyFilter(array, query) {
		return filterService.propertyFilter(array, query);
	}

	 function addNewBidiagnosis() {

        if (($scope.case.hasOwnProperty('biDiagnoses'))) {
            if ($scope.case.biDiagnoses.indexOf(null) < 0) {
                  $scope.case.biDiagnoses.push(null);
                }
        }
        else {
            $scope.case.biDiagnoses = new Array();
            $scope.case.biDiagnoses.push(null);
        }
    }

	function lookupCPR() {
		cprService.getCPRData($scope.case.cprNumber)
			.then(function (response) {
				var res = response.data[0];
				var name = res.NAVN.split(',');

				$scope.case.firstName = name[1];
				$scope.case.lastName = name[0];
				$scope.case.address = res.GADE;
				$scope.case.postbox = res.POSTNR;
				$scope.case.city = res.BY;
			});
	}

	function isNumber(number) {
		return isNaN(number) ? false : true;
	}

	function lockCaseDialog() {
		$mdDialog.show({
			templateUrl: 'app/src/declaration/view/lock-dialog.html',
			scope: $scope, // use parent scope in template
			preserveScope: true, // do not forget this if use parent scope
			clickOutsideToClose: true
		});
	}

	function unlockCase() {
		DeclarationService.unlock($scope.case)
			.then(function () {
				HeaderService.resetActions();
				activated();
				Toast.show('Sagen er låst op')
			});
	}

	function editCase() {
		$scope.editPatientData = true;
		lockedForEdit(true);
		HeaderService.resetActions();
		HeaderService.addAction('DECLARATION.SAVE_AND_LOCK', 'save', lockCaseDialog)
		HeaderService.addAction('COMMON.SAVE', 'save', saveCase)
	}

	function lockedForEdit(lock) {
		var currentUser = authService.getUserInfo().user;
		var locked = {
			'node-uuid': $scope.case['node-uuid'],
			locked4edit: lock,
			locked4editBy: lock ? currentUser : {}
		};

		DeclarationService.update(locked);
	}

	function saveCase() {
		$scope.case.fullName = $scope.case.firstName + ' ' + $scope.case.lastName;
		$scope.case.locked4edit = false;
		$scope.case.locked4editBy = {};

		DeclarationService.update($scope.case)
			.then(function () {
				$scope.editPatientData = false;
				activated();
				Toast.show('Ændringerne er gemt');
			});
	}

	$scope.closeCase = function () {
		$scope.case.locked4edit = false;
		$scope.case.locked4editBy = {};
		$scope.case.closed = true;

		if ($scope.closeCaseParams.closed == 'no-declaration') {
			$scope.case.closedWithoutDeclaration = true;
		}

		$scope.case.closedWithoutDeclarationReason = $scope.closeCaseParams.reason;
		$scope.case.closedWithoutDeclarationSentTo = $scope.closeCaseParams.sentTo;

		DeclarationService.update($scope.case)
			.then(function () {
				HeaderService.resetActions();
				HeaderService.setClosed(true);
				activated();
				$mdDialog.cancel();
			})
	}

	$scope.cancel = function () {
		$mdDialog.cancel();
	}
}