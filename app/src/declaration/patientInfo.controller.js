'use strict';

angular
	.module('openDeskApp.declaration')
	.controller('PatientInfoController', PatientInfoController);

function PatientInfoController($scope, $rootScope, $stateParams, $mdToast, $mdDialog, entryService, filterService, loadingService, cprService, HeaderService) {

	var vm = this;
	$scope.entryService = entryService;
	$scope.editPatientData = false;
	$scope.case;

	$scope.waitTime = {
		passive: null,
		active: null,
		total: null
	};

	$scope.propertyFilter = propertyFilter;
	$scope.addNewBidiagnosis = addNewBidiagnosis;
	vm.lookupCPR = lookupCPR;
	vm.isNumber = isNumber;

	HeaderService.resetActions();
	loadingService.setLoading(true);
	activated();

	angular.element(document).ready(function () {
		loadingService.setLoading(false);
	});

	function activated() {
		entryService.getEntry($stateParams.caseid)
			.then(function (response) {
				$scope.case = response
				$scope.waitTime = getWaitingTimes(response);
				var bua = response.bua ? ' (BUA)' : '';
				HeaderService.setTitle(response.firstName + ' ' + response.lastName + ' (' + response.caseNumber + ')' + bua);
				HeaderService.setClosed(response.closed);
				if (!response.closed) {
					HeaderService.addAction('DECLARATION.LOCK', 'lock', lockCaseDialog)
					HeaderService.addAction('COMMON.EDIT', 'edit')
				}
			})
	}

	$scope.$watch('entryService.isEditing()', function (newVal) {
		$scope.editPatientData = newVal;
	});

	function propertyFilter(array, query) {
		return filterService.propertyFilter(array, query);
	}

	function addNewBidiagnosis() {
		console.log($scope.case.biDiagnoses.indexOf(''));

		if ($scope.case.biDiagnoses.indexOf('') < 0) {
			$scope.case.biDiagnoses.push('');
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
			}).error(function (err) {
				$mdToast.show(
					$mdToast.simple()
						.textContent('Ingen person med CPR nummeret ' + $scope.case.cprNumber)
						.position('top right')
						.hideDelay(3000)
				);
			});
	}

	function getWaitingTimes(res) {
		var creationDate = new Date(res.creationDate);
		var observationDate = new Date(res.observationDate);
		var declarationDate = new Date(res.declarationDate);

		var wait = {};

		wait.passive = Math.ceil((observationDate - creationDate) / 1000 / 60 / 60 / 24);
		wait.active = Math.ceil((declarationDate - observationDate) / 1000 / 60 / 60 / 24);
		wait.total = Math.ceil((declarationDate - creationDate) / 1000 / 60 / 60 / 24);

		return wait;
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

	$scope.closeCase = function () {
		$scope.case.locked4edit = false;
		$scope.case.locked4editBy = {};

		$scope.case.closed = true;

		if ($scope.closeCaseParams.closed == 'no-declaration') {
			$scope.case.closedWithoutDeclaration = true;
		}

		$scope.case.closedWithoutDeclarationReason = $scope.closeCaseParams.reason;
		$scope.case.closedWithoutDeclarationSentTo = $scope.closeCaseParams.sentTo;

		entryService.updateEntry($scope.case)
			.then(function () {
				HeaderService.setClosed(true);
				$mdDialog.cancel();
			})
	}
}