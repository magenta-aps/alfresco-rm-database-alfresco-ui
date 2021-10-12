'use strict';

angular
	.module('openDeskApp.declaration')
	.controller('PatientInfoController', PatientInfoController);

function PatientInfoController($scope, $state, $stateParams, $mdDialog, DeclarationService, filterService, cprService, authService, Toast, HeaderService, $filter, $timeout, $q) {

	var vm = this;
	$scope.DeclarationService = DeclarationService;
	$scope.editPatientData = false;
	$scope.case;
	$scope.isLoading = false;
	vm.backtosearch = false;
	vm.enforceSolar = $stateParams.enforceSolarDelay;
	$scope.propertyFilter = propertyFilter;
	$scope.addNewBidiagnosis = addNewBidiagnosis;
	vm.lookupCPR = lookupCPR;
	vm.isNumber = isNumber;
	vm.makeDeclarationDocument = makeDeclarationDocument;
	vm.makeBerigtigelsesDocument = makeBerigtigelsesDocument;
	vm.gobacktosearch = gobacktosearch;

	vm.createdDateBeforeEdit;
	vm.declaratiotionDateBeforeEdit;

	vm.declarationState = "";

	vm.isOpenForTMPEdit = false;

	vm.waitPromiseSupopl = function(state) {
		if ($scope.case.closedWithoutDeclaration) {
			$scope.closeCaseParams = {closed : 'no-declaration'}
		}
		else {
			$scope.closeCaseParams = {closed : ''}
		}
		vm.declarationState = state;

		HeaderService.addAction('Genvej til flowchart', 'bar_chart', shortcutToFlowchart);
		HeaderService.addAction('COMMON.EDIT', 'edit', editCase);
		HeaderService.addAction('DECLARATION.LOCK_TMP', 'lock', $scope.closeCase);
		vm.enforceSolar = false;

		// var defer = $q.defer();
		// $timeout(function() {

		// 	}, 15000);
		// return defer.promise;
	};

	vm.waitPromiseNormal = function(declarationSettings_, state) {
		vm.declarationState = state;
		HeaderService.addAction('Opret erklæring', 'description', makeDeclarationDocument, false, declarationSettings_)
		HeaderService.addAction('Genvej til flowchart', 'bar_chart', shortcutToFlowchart);
		HeaderService.addAction('DECLARATION.LOCK', 'lock', lockCaseDialog);
		HeaderService.addAction('COMMON.EDIT', 'edit', editCase);
		vm.enforceSolar = false;
	};

	vm.waitPromiseCanUnlock = function() {
		HeaderService.addAction('DECLARATION.UNLOCK', 'lock_open', unLockCaseDialog);
		vm.enforceSolar = false;
	};

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

	function makeBerigtigelsesDocument() {
		DeclarationService.makeBerigtigelsesDocument($scope.case)
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

		DeclarationService.getStateOfDeclaration(response.caseNumber).then (function(stateReponse) {

			// either normalediting or speciel edit if case has been reopened
			if (stateReponse.data.temporaryEdit) {

				// do speciel edit
				vm.declarationState = stateReponse.data.state;
				vm.isOpenForTMPEdit = true;


				// check if you have to wait for solar consistency - triggering edit on a case that was just saved messes up the menu if solr hasn't finished indexing
				if (stateReponse.data.hasAspectSupopl == true) {

					if (vm.enforceSolar) {
						vm.waitPromiseSupopl(stateReponse.data.state);
					}
					else {
						HeaderService.addAction('Genvej til flowchart', 'bar_chart', shortcutToFlowchart);
						HeaderService.addAction('DECLARATION.KONKLUSKABELON_OPRET', 'create', makeBerigtigelsesDocument);
						HeaderService.addAction('COMMON.EDIT', 'edit', editCase);

						if ($scope.case.closedWithoutDeclaration) {
							$scope.closeCaseParams = {closed : 'no-declaration'}
						}
						else {
							$scope.closeCaseParams = {closed : ''}
						}
						 HeaderService.addAction('DECLARATION.LOCK_TMP', 'edit', $scope.closeCase);
					}
				}
				else {
					HeaderService.addAction('COMMON.EDIT', 'edit', editCase);

					if ($scope.case.closedWithoutDeclaration) {
						$scope.closeCaseParams = {closed : 'no-declaration'}
					}
					else {
						$scope.closeCaseParams = {closed : ''}
					}
					HeaderService.addAction('DECLARATION.LOCK_TMPOPENEDIT', 'edit', $scope.closeCase);

				}
			}
			else {
				vm.declarationState = stateReponse.data.state;
				if (!response.closed) {

					if (vm.enforceSolar) {
						vm.waitPromiseNormal(declarationSettings, stateReponse.data.state);
					}
					else {
						HeaderService.addAction('Opret erklæring', 'description', makeDeclarationDocument, false, declarationSettings)
						HeaderService.addAction('Genvej til flowchart', 'bar_chart', shortcutToFlowchart);
						HeaderService.addAction('DECLARATION.LOCK', 'lock', lockCaseDialog);
						HeaderService.addAction('COMMON.EDIT', 'edit', editCase);
					}
				} else {
					if (HeaderService.canUnlockCases()) {
						if (vm.enforceSolar) {
							vm.waitPromiseCanUnlock();
						}
						else {
							HeaderService.addAction('DECLARATION.UNLOCK', 'lock_open', unLockCaseDialog);
						}

					}
				}
			}
		});
	}



	function isOpenForTMPEdit() {
		return DeclarationService.getStateOfDeclaration($scope.case.caseNumber).then (function(stateReponse) {
			return (stateReponse.data.temporaryEdit);
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

	function lockCase() {
		if ($scope.case.closedWithoutDeclaration) {
			$scope.closeCaseParams = {closed : 'no-declaration'}
		}
		else {
			$scope.closeCaseParams = {closed : ''}
		}
		$scope.closeCase();
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

				Toast.show('Sagen er låst op')
                $mdDialog.cancel();

				if (($scope.unlockCaseParams == 'reopenEdit')) {
					// open for edit
					vm.isOpenForTMPEdit = true;
					editCase()
				} else {
					HeaderService.resetActions();
					activated();
					vm.isOpenForTMPEdit = true;
				}
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
							lockedForEdit(true).then(function (response) {
								HeaderService.resetActions();

								// check if this was a usecase of reopening a case, then dont show lockCaseDialog, instead, just lock the case again after save has been finished. just extend savecase like closecase has been done.
								if (vm.isOpenForTMPEdit) {

									// if edit for sup then dont saveandclose - evt. lav et opslag og se om den har et aspekt..... her

									DeclarationService.getStateOfDeclaration(response.caseNumber).then (function(stateReponse) {
										if (stateReponse.data.hasAspectSupopl == true) {
											HeaderService.addAction('COMMON.SAVE', 'save', saveCase)
										}
										else {
											HeaderService.addAction('DECLARATION.KONKLUSKABELON_OPRET', 'create', makeBerigtigelsesDocument);
											HeaderService.addAction('COMMON.SAVE', 'save', saveCaseAndClose);
										}
									});
								}
								else {
									HeaderService.addAction('DECLARATION.SAVE_AND_LOCK', 'save', lockCaseDialog)
									HeaderService.addAction('COMMON.SAVE', 'save', saveCase)
								}

							});
                        })
	}

	function lockedForEdit(lock) {
		var currentUser = authService.getUserInfo().user.userName;
		var locked = {
			'node-uuid': $scope.case['node-uuid'],
			locked4edit: lock,
			locked4editBy: lock ? currentUser : {}
		};

		return DeclarationService.update(locked);
	}

	function saveCase() {
		$scope.case.fullName = $scope.case.firstName + ' ' + $scope.case.lastName;
		$scope.case.locked4edit = false;
		$scope.case.locked4editBy = {};

		if (!$scope.case.hasOwnProperty("closedWithoutDeclaration")) {
				$scope.case.closedWithoutDeclaration = false;
		}

		$scope.case.closeCaseButtonPressed = false;


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

				var dec_before_formatted = $filter('date')(vm.declaratiotionDateBeforeEdit,'yyyy-MM-dd');
				var dec_after_formatted = $filter('date')($scope.case.declarationDate,'yyyy-MM-dd');

				var dec_year_before = $filter('date')(vm.declaratiotionDateBeforeEdit,'yyyy');
				var dec_year_after = $filter('date')($scope.case.declarationDate,'yyyy');

				var dec_updateCalculatedStat = (dec_before_formatted != dec_after_formatted);

				if (updateCalculatedStat) {
					if (year_before == year_after) {
						DeclarationService.updateStat(year_after);
					}
					else {
						DeclarationService.updateStat(year_before);
						DeclarationService.updateStat(year_after);
					}
				}

				if (dec_updateCalculatedStat) {
					if (dec_year_before == dec_year_after) {
						DeclarationService.updateStat(dec_year_after);
					}
					else {
						DeclarationService.updateStat(dec_year_before);
						DeclarationService.updateStat(dec_year_after);
					}
				}
				$state.go('declaration.show', { caseid: $scope.case.caseNumber, enforceSolarDelay: true }, {reload: true});
			});
	}

	function saveCaseAndClose() {
		vm.isOpenForTMPEdit = false;

		$scope.case.fullName = $scope.case.firstName + ' ' + $scope.case.lastName;
		$scope.case.locked4edit = false;
		$scope.case.locked4editBy = {};

		if (!$scope.case.hasOwnProperty("closedWithoutDeclaration")) {
			$scope.case.closedWithoutDeclaration = false;
		}

		$scope.case.closeCaseButtonPressed = false;


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

				var dec_before_formatted = $filter('date')(vm.declaratiotionDateBeforeEdit,'yyyy-MM-dd');
				var dec_after_formatted = $filter('date')($scope.case.declarationDate,'yyyy-MM-dd');

				var dec_year_before = $filter('date')(vm.declaratiotionDateBeforeEdit,'yyyy');
				var dec_year_after = $filter('date')($scope.case.declarationDate,'yyyy');

				var dec_updateCalculatedStat = (dec_before_formatted != dec_after_formatted);

				if (updateCalculatedStat) {
					if (year_before == year_after) {
						DeclarationService.updateStat(year_after);
					}
					else {
						DeclarationService.updateStat(year_before);
						DeclarationService.updateStat(year_after);
					}
				}

				if (dec_updateCalculatedStat) {
					if (dec_year_before == dec_year_after) {
						DeclarationService.updateStat(dec_year_after);
					}
					else {
						DeclarationService.updateStat(dec_year_before);
						DeclarationService.updateStat(dec_year_after);
					}
				}

				if ($scope.case.closedWithoutDeclaration) {
					$scope.closeCaseParams = {closed : 'no-declaration'}
				}
				else {
					$scope.closeCaseParams = {closed : ''}
				}

				// $state.reload;
				$scope.closeCase();

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

		$scope.case.closeCaseButtonPressed = true;

		$scope.case.closedWithoutDeclarationReason = $scope.closeCaseParams.reason;
		$scope.case.closedWithoutDeclarationSentTo = $scope.closeCaseParams.sentTo;
		$scope.case.returnOfDeclarationDate = $scope.closeCaseParams.returnOfDeclarationDate;

		DeclarationService.update($scope.case)
				.then(function () {

				// HeaderService.resetActions();
				// HeaderService.setClosed(true);
				// activated();
				// $mdDialog.cancel();
				$state.go('declaration.show', { caseid: $scope.case.caseNumber, enforceSolarDelay: true }, {reload: true});
				})
	}

	$scope.cancel = function () {
		$mdDialog.cancel();
	}
}



