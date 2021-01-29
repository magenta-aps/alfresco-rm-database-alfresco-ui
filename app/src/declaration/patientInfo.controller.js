'use strict';

angular
	.module('openDeskApp.declaration')
	.controller('PatientInfoController', PatientInfoController);

function PatientInfoController($scope, $state, $stateParams, $mdDialog, DeclarationService, filterService, cprService, authService, Toast, HeaderService, $filter) {

	var vm = this;
	$scope.DeclarationService = DeclarationService;
	$scope.editPatientData = false;
	$scope.case;
	$scope.isLoading = false;
	vm.backtosearch = false;

	$scope.propertyFilter = propertyFilter;
	$scope.addNewBidiagnosis = addNewBidiagnosis;
	vm.lookupCPR = lookupCPR;
	vm.isNumber = isNumber;
	vm.makeDeclarationDocument = makeDeclarationDocument;
	vm.gobacktosearch = gobacktosearch;

	vm.createdDateBeforeEdit;
	vm.declaratiotionDateBeforeEdit;

	vm.declarationState = "";


	$scope.$on('$destroy', function () {
		if ($scope.case.locked4edit) {
			lockedForEdit(false);
		}
	});

    if (Object.keys($stateParams.searchquery).length) {
        vm.backtosearch = false;
        HeaderService.updateBacktosearch($stateParams.searchquery);
    }

	activated();

	function makeDeclarationDocument() {
		DeclarationService.makeDeclarationDocument($scope.case)
			.then(function (response) {
				$state.go('document', { doc: response.id });
			});
	}

	function shortcutToFlowchart() {
				$state.go('flowchart', { declarationShortcutId: $scope.case["node-uuid"], category: vm.declarationState });
	}

	function gobacktosearch() {
        $state.go('declaration.advancedSearch', { searchquery: $stateParams.searchquery });
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

		var shortCutSettings = {
			tooltip: "Genvej til flowchart"
		}

		if ($scope.case.hasOwnProperty('returnOfDeclarationDate')) {
			$scope.case.returnOfDeclarationDate = new Date($scope.case.returnOfDeclarationDate);
		}




		if (vm.backtosearch) {
            HeaderService.addAction('Tilbage til søgning', 'description', gobacktosearch, false)
        }

		// only show button for flowchart if it has a state that will make it visible inside the flowchart

		DeclarationService.getStateOfDeclaration(response.caseNumber).then (function(response) {

			if (response.data.state != "nostate") {
				vm.declarationState = response.data.state;
				HeaderService.addAction('Genvej til flowchart', 'bar_chart', shortcutToFlowchart);
				HeaderService.addAction('Opret erklæring', 'description', makeDeclarationDocument, false, declarationSettings)

				if (!response.closed) {
					HeaderService.addAction('DECLARATION.LOCK', 'lock', lockCaseDialog);
					HeaderService.addAction('COMMON.EDIT', 'edit', editCase);

				} else {
					if (HeaderService.canUnlockCases()) HeaderService.addAction('DECLARATION.UNLOCK', 'lock_open', unLockCaseDialog);
				}

			}
			else {
				HeaderService.addAction('Opret erklæring', 'description', makeDeclarationDocument, false, declarationSettings)
				if (!response.closed) {
					HeaderService.addAction('DECLARATION.LOCK', 'lock', lockCaseDialog);
					HeaderService.addAction('COMMON.EDIT', 'edit', editCase);

				} else {
					if (HeaderService.canUnlockCases()) HeaderService.addAction('DECLARATION.UNLOCK', 'lock_open', unLockCaseDialog);
				}
			}
		});











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

    function unLockCaseDialog() {
        $mdDialog.show({
            templateUrl: 'app/src/declaration/view/unLock-dialog.html',
            scope: $scope, // use parent scope in template
            preserveScope: true, // do not forget this if use parent scope
            clickOutsideToClose: true
        });
    }

    $scope.unlockCase = function () {

		DeclarationService.unlock($scope.case, $scope.unlockCaseParams)
			.then(function () {
				HeaderService.resetActions();
				activated();
				Toast.show('Sagen er låst op')
                $mdDialog.cancel();
			});
	}

	function editCase() {

		var currentUser = authService.getUserInfo().user.userName;

		// reload case, as it might have been locked by another user

        DeclarationService.get($stateParams.caseid)
                        .then(function (response) {
						vm.createdDateBeforeEdit = response.creationDate;
						vm.declaratiotionDateBeforeEdit = response.declarationDate;

                        if (response.locked4edit) {

                        if (currentUser != $scope.case.locked4editBy) {
                		        alert("sagen er låst for redigering af " + response.locked4editBy);
                		        return false;
                		    }
                		}

                		$scope.editPatientData = true;
                		lockedForEdit(true);
                		HeaderService.resetActions();
                		HeaderService.addAction('DECLARATION.SAVE_AND_LOCK', 'save', lockCaseDialog)
                		HeaderService.addAction('COMMON.SAVE', 'save', saveCase)





                        })











	}

	function lockedForEdit(lock) {
		var currentUser = authService.getUserInfo().user.userName;
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

		if (!$scope.case.hasOwnProperty("closedWithoutDeclaration")) {
				$scope.case.closedWithoutDeclaration = false;
		}


		DeclarationService.update($scope.case)
			.then(function () {
				$scope.editPatientData = false;
				activated();
				Toast.show('Ændringerne er gemt');


				// creationdate
				var before_formatted = $filter('date')(vm.createdDateBeforeEdit,'yyyy-MM-dd');
				var after_formatted = $filter('date')($scope.case.creationDate,'yyyy-MM-dd');

				var year_before = $filter('date')(vm.createdDateBeforeEdit,'yyyy');
				var year_after = $filter('date')($scope.case.creationDate,'yyyy');

				var updateCalculatedStat = (before_formatted != after_formatted);
				console.log("hvad er updatecal" + updateCalculatedStat);


				var dec_before_formatted = $filter('date')(vm.declaratiotionDateBeforeEdit,'yyyy-MM-dd');
				var dec_after_formatted = $filter('date')($scope.case.declarationDate,'yyyy-MM-dd');

				var dec_year_before = $filter('date')(vm.declaratiotionDateBeforeEdit,'yyyy');
				var dec_year_after = $filter('date')($scope.case.declarationDate,'yyyy');

				var dec_updateCalculatedStat = (dec_before_formatted != dec_after_formatted);

				console.log("hvad er dec_updateCalculatedStat");
				console.log(dec_updateCalculatedStat);

				if (updateCalculatedStat) {
					if (year_before == year_after) {
						DeclarationService.updateStat(year_after);
					}
					else {
						console.log("both years need an update")
						DeclarationService.updateStat(year_before);
						DeclarationService.updateStat(year_after);
					}
				}

				if (dec_updateCalculatedStat) {
					if (dec_year_before == dec_year_after) {
						DeclarationService.updateStat(dec_year_after);
					}
					else {
						console.log("both years need an update in declaration")
						DeclarationService.updateStat(dec_year_before);
						DeclarationService.updateStat(dec_year_after);
					}
				}

				$state.reload();
			});
	}

	$scope.closeCase = function () {
		$scope.case.locked4edit = false;
		$scope.case.locked4editBy = {};
		$scope.case.closed = true;

		if ($scope.closeCaseParams.closed == 'no-declaration') {
			$scope.case.closedWithoutDeclaration = true;
		}
		else {
			$scope.case.closedWithoutDeclaration = false;
		}

		$scope.case.closedWithoutDeclarationReason = $scope.closeCaseParams.reason;
		$scope.case.closedWithoutDeclarationSentTo = $scope.closeCaseParams.sentTo;
		$scope.case.returnOfDeclarationDate = $scope.closeCaseParams.returnOfDeclarationDate;

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
