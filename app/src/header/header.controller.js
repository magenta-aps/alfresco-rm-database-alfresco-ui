'use strict';

angular
    .module('openDeskApp')
    .controller('HeaderController', HeaderController);

function HeaderController($scope, $transitions, HeaderService, authService, $state, $timeout) {

    var vm = this;

    vm.title = '';
    vm.caseId = 0;
    vm.actions = [];
    vm.isClosed = false;
    vm.loggedIn = false;
    vm.previous = null;

    vm.canAccessSettings = canAccessSettings;
    vm.getUserName = getUserName;
    vm.logout = logout;

    $scope.$on('updateHeader', function () {
        updateHeaderTitle();
        updateCaseId();
        updateHeaderActions();
        updateIsClosed();
        isLoggedIn();
    });

  	// when transitioning to the view, store which view we came from
  	$transitions.onStart({ to: 'declaration.show.patientdata' }, function (transition) {
      var previousView = transition.$from();
      if (previousView.name === 'declaration.advancedSearch' || previousView.name === 'flowchart') {
        vm.previous = {
          name: transition.from().name,
          params: transition.params()
        }
      } else {
        vm.previous = null;
      }
  	});

    function goback() {
        HeaderService.setBacktosearchStatus(false);
    $timeout(function() {
       $state.go(vm.previous.name, vm.previous.params);
       vm.previous = null
    });


	}
	vm.goback = goback;

    function isLoggedIn() {
        vm.loggedIn = authService.loggedin();
    }

    function updateHeaderTitle() {
        vm.title = HeaderService.getTitle();
    }

    function updateCaseId() {
        vm.caseId = HeaderService.getCaseId();
    }

    function updateHeaderActions() {
        vm.actions = HeaderService.getActions();
    }

    function getUserName() {
        return HeaderService.getUserName();
    }

    function canAccessSettings() {
        return HeaderService.canAccessSettings();
    }

    function logout() {
        return authService.logout();
    }

    function updateIsClosed() {
        vm.isClosed = HeaderService.isClosed();
    }
}
