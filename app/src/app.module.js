angular
    .module('openDeskApp', [
        'ngSanitize',
        'ngMaterial',
        'ngMessages',
        'ngCookies',
        'material.wizard',
        'ui.router',
        'rt.encodeuri',
        'ngResource',
        'pdf',
        'swfobject',
        'isteven-multi-select',
        'openDeskApp.init',
        'openDeskApp.auth',
        'openDeskApp.sites',
        'openDeskApp.site',
        'openDeskApp.translations.init',
        'openDeskApp.header',
        'openDeskApp.dashboard',
        'openDeskApp.lool',
        'openDeskApp.documents',
        'openDeskApp.administration',
        'openDeskApp.users',
        'openDeskApp.systemsettings',
        'openDeskApp.search',
        'openDeskApp.calendar',
        'openDeskApp.nogletal',

        'openDeskApp.common.directives',
        'openDeskApp.common.directives.filter',
        'm43nu.auto-height',
        'dcbImgFallback',
        'openDeskApp.notifications',
        //'openDeskApp.discussion',
        // 'openDeskApp.chat',
        'openDeskApp.user',
        'openDeskApp.menu',
        'openDeskApp.declaration',
        'md.data.table',

        /*DO NOT REMOVE MODULES PLACEHOLDER!!!*/ //openDesk-modules
        /*LAST*/
        'openDeskApp.translations'
    ]) //TRANSLATIONS IS ALWAYS LAST!
    .config(config)
    .run(function ($rootScope, $transitions, $state, $mdDialog, authService, sessionService, APP_CONFIG) {
        $rootScope.ssoLoginEnabled = APP_CONFIG.ssoLoginEnabled == "true";
        angular.element(window.document)[0].title = APP_CONFIG.appName;
        $rootScope.appName = APP_CONFIG.appName;
        $rootScope.logoSrc = APP_CONFIG.logoSrc;
        if ($state.current.url == "^")
            $state.go(APP_CONFIG.landingPage);
    });

function config($stateProvider, $mdDateLocaleProvider, $mdThemingProvider) {

    var regionMidtMap = $mdThemingProvider.extendPalette('red', {
        '500': '#990033',
    });

    // Register the new color palette map with the name <code>neonRed</code>
    $mdThemingProvider.definePalette('regionMidt', regionMidtMap);

    // Use that theme for the primary intentions
    $mdThemingProvider.theme('default')
        .primaryPalette('regionMidt');

    $stateProvider.decorator('data', function (state, parent) {
        var stateData = parent(state);

        state.resolve = state.resolve || {};
        state.resolve.authorize = ['authService', '$q', 'sessionService', '$state', '$rootScope', '$stateParams','propertyService',
            function (authService, $q, sessionService, $state, $rootScope, $stateParams, propertyService) {
                var d = $q.defer();
                if (authService.isAuthenticated() && authService.isAuthorized($stateParams.authorizedRoles)) {
                    // I also provide the user for child controllers
                    d.resolve(authService.user);
                    propertyService.initPropertyValues();
                } else {
                    // here the rejection
                    if ($rootScope.ssoLoginEnabled) {
                        authService.ssoLogin().then(function (response) {
                            if (authService.isAuthenticated() && authService.isAuthorized($stateParams.authorizedRoles))
                                d.resolve(authService.user);
                            else {
                                d.reject('Not logged in or lacking authorization!');
                                sessionService.retainCurrentLocation();
                                $state.go('login');
                            }
                        });
                    } else {
                        d.reject('Not logged in or lacking authorization!');
                        sessionService.retainCurrentLocation();
                        $state.go('login');
                    }
                }
                return d.promise;
            }
        ];
        return stateData;
    });

    $stateProvider.state('site', {
        abstract: true,
        views: {
            'header@': {
                templateUrl: 'app/src/header/view/header.html'
            },
            'footer@': {
                template: '<img src="app/assets/images/rm-weblogo.jpg" class="rm-logo">'
            }
        }
    });

    $mdDateLocaleProvider.firstDayOfWeek = 1;

    $mdDateLocaleProvider.formatDate = function (date) {
        if (date == undefined)
            return;
        var day = ('0' + date.getDate()).slice(-2);
        var month = ('0' + (date.getMonth() + 1)).slice(-2);
        var year = date.getFullYear();

        return day + '/' + month + '/' + year;

    };
}