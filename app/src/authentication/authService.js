angular
    .module('openDeskApp')
    .factory('authService', authService);

function authService($q, $http, $window, $state, sessionService) {
    var service = {
        login: login,
        logout: logout,
        loggedin: loggedin,
        changePassword: changePassword,
        isAuthenticated: isAuthenticated,
        isAuthorized: isAuthorized,
        getUserInfo: getUserInfo,
        revalidateUser: revalidateUser,
        ssoLogin: ssoLogin,
        setUserRolesForSite: setUserRolesForSite,
        getUserRoles: getUserRoles
    };

    return service;

    var roles = [];

    function getUserInfo() {
        return sessionService.getUserInfo();
    }

    function ssoLogin() {
        var userInfo = {};
        return $http.get("/alfresco/s/ssologin").then(function (response) {
            var username = response.data;
            return $http.get("/api/people/" + username).then(function (response) {
                userInfo.user = response.data;
                sessionService.setUserInfo(userInfo);
                return addUserToSession(username);
            }, function (error) {
                console.log(error);
                return error;
            });
        });
    }

    function authFailedSafari(response) {
        return response.data && response.data.indexOf('Safari') != -1;
    }

    function login(username, password) {
        var userInfo = {};
        return $http.post("/api/login", {
            username: username,
            password: password
        }).then(function (response) {
            userInfo.ticket = response.data.data.ticket;
            sessionService.setUserInfo(userInfo);
            return addUserToSession(username);
        }, function (reason) {
            console.log(reason);
            return reason;
        });
    }

    function logout() {
        var userInfo = sessionService.getUserInfo();


        if (userInfo) {
            var ticket = userInfo.ticket;
            sessionService.clearRetainedLocation();
            $http.delete('/api/login/ticket/' + ticket, {
                alf_ticket: ticket
            }).then(function () {
                $state.go('login');
            });
        }

    }

    function loggedin() {
        return sessionService.getUserInfo();
    }

    /**
     * Accepts a user email (which should be unique) bound to a unique user name, recreates a password for the user
     * and emails the user with the details required to login to the system.
     * @param email
     * @returns {*}
     */
    function changePassword(email) {
        return $http.post("/api/opendesk/reset-user-password", {
            email: email
        }).then(function (response) {
            return response;
        });
    }

    function isAuthenticated() {
        return sessionService.getUserInfo();
    }

    function isAuthorized(authorizedRoles) {
        var userInfo = sessionService.getUserInfo();
        if (typeof userInfo === 'undefined') {
            return $q.resolve(false);
        }
        //if admin we don't care return true immediately
        if (userInfo.user.capabilities.isAdmin)
            return $q.resolve(true);

        if (!angular.isArray(authorizedRoles)) {
            authorizedRoles = [authorizedRoles];
        }

        //We should loop through each authorized role and return true as soon as we detect a true value
        for (var n = 0; n < authorizedRoles.length; n++) {
            if (authorizedRoles[n] === 'user' || roles.indexOf(authorizedRoles[n]) > -1) {
                return true;
            }
        }
    }

    function revalidateUser() {
        return $http.get('/alfresco/s/ssologin').then(function (response) {
            return addUserToSession(response.data);
        });
    }

    function addUserToSession(username) {
        return getUser(username).then(function (user) {
            delete $window._openDeskSessionExpired;
            var userInfo = sessionService.getUserInfo();
            userInfo['user'] = user;
            sessionService.setUserInfo(userInfo);
            return user;
        });
    }

    function getUser(username) {
        return $http.get('/api/people/' + username).then(function (response) {
            return response.data;
        });
    }

    function setUserRolesForSite(siteShortName) {
        return $http.get('/alfresco/s/database/' + siteShortName + '/role').then(function (response) {
            roles = response.data;
            return roles;
        });
    }

    function getUserRoles() {
        return roles;
    }
}