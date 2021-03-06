'use strict';

angular
    .module('openDeskApp')
    .controller('AuthController', AuthController);

function AuthController(APP_CONFIG, $state, $http, $stateParams, authService, $mdDialog, sessionService, $window) {
    var vm = this;
    var loginErrorMessage = angular.fromJson($stateParams.error);

    vm.login = login;
    vm.getUserInfo = getUserInfo;
    vm.errorMsg = loginErrorMessage ? loginErrorMessage : "";
    vm.showForgotDialog = showForgotDialog;
    vm.updateValidator = updateValidator;

    function getUserRoles() {
        vm.userRoles = authService.getUserRoles();
    }
    getUserRoles();

    function login(credentials) {
        authService.login(credentials.username, credentials.password)
            .then(function (response) {
                // If incorrect values            
                if (response.status == 403) {
                    vm.form.password.$setValidity("loginFailure", false);
                    vm.errorMsg = "Forkert brugernavn eller kodeord."
                    return
                } else if (response.status == 500) {
                    vm.form.password.$setValidity("loginError", false);
                    vm.errorMsg = "Forkert brugernavn eller kodeord."
                    return
                }

                $http.get(`/alfresco/service/isActivated?userName=${credentials.username}`)
                    .then(function (response) {
                        if (response.data.member) {
                            authService.getUser(credentials.username)
                                .then(function (response) {
                                    vm.user = response;
                                    restoreLocation();
                                });
                        } else {
                            vm.errorMsg = 'Du er ikke aktiveret. Kontakt din nærmeste leder.'
                            delete vm.user;
                            authService.logout();
                        }
                    })
            })
    }

    function restoreLocation() {
        var retainedLocation = sessionService.getRetainedLocation();
        if (!retainedLocation || retainedLocation === undefined) {
            $state.go(APP_CONFIG.landingPage);
        } else {
            $window.location = retainedLocation;
        }
    }

    function updateValidator() {
        if (vm.form.password.$error.loginFailure)
            vm.form.password.$setValidity("loginFailure", true);
    }

    function forgotPasswordCtrl($scope, $mdDialog) {
        var dlg = this;
        dlg.emailSent = false;

        dlg.cancel = function () {
            return $mdDialog.cancel();
        };

        dlg.updateValidators = function () {
            if (dlg.form.email.$error.emailNotExists)
                dlg.form.email.$setValidity("emailNotExists", true);
        };

        dlg.forgotPassword = function () {
            if (!dlg.email) return;

            authService.changePassword(dlg.email).then(
                function success(response) {
                    dlg.emailSent = true;
                },

                function onError(response) {
                    // If email doesn't exist in system
                    if (response.status !== 200)
                        dlg.form.email.$setValidity("emailNotExists", false);
                }
            );
        };
    }

    function showForgotDialog(ev) {
        $mdDialog.show({
            controller: forgotPasswordCtrl,
            controllerAs: 'dlg',
            templateUrl: 'app/src/authentication/view/forgotPasswordDialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        });
    }

    function getUserInfo() {
        var userInfo = authService.getUserInfo();
        return userInfo;
    }

}
