angular
    .module('openDeskApp.systemsettings', ['ngMaterial', 'pascalprecht.translate'])
    .config(config);

function config(systemSettingsPagesServiceProvider, $stateProvider, USER_ROLES) {
    systemSettingsPagesServiceProvider.addPage('Projektskabeloner', 'administration.systemsettings.templateList', true);
    systemSettingsPagesServiceProvider.addPage('Dokumentskabeloner', 'document_templates', true);

    $stateProvider.state('administration.systemsettings', {
        // url: '/systemindstillinger',
        data: {
            authorizedRoles: [USER_ROLES.user],
        },
        views: {
            'systemsettings': {
                templateUrl: 'app/src/system_settings/system_settings.html',
                controller: 'SystemSettingsController',
                controllerAs: 'vm'
            }
        },
        redirectTo: 'administration.systemsettings.dashboard'
    })
    .state('administration.systemsettings.dashboard', {
        // url: '/dashboard',
        data: {
            authorizedRoles: [USER_ROLES.user]
        },
        views: {
            'systemsetting-view': {
                templateUrl: 'app/src/system_settings/dashboard/view/dashboard.html',
            }
        }
    })
    .state('administration.systemsettings.practitioners', {
        url: '/behandlere',
        data: {
            authorizedRoles: [USER_ROLES.user]
        },
        views: {
            'systemsetting-view': {
                templateUrl: 'app/src/system_settings/practitioners/view/practitioner-list.html',
                controller: 'PractitionerController',
                controllerAs: 'vm'
            },
            'toolbar-tools-left@site': {
                template: "<h2>{{ 'ADMIN.ADMINISTRATION' | translate }} – Behandlere</h2>"
            },
            'toolbar-tools-right@site': {
                templateUrl: 'app/src/system_settings/practitioners/view/practitioner-toolbar.html',
                controller: 'PractitionerToolbarController',
                controllerAs: 'vm'
            }
        }
    })
    .state('administration.systemsettings.diagnosis', {
        url: '/diagnoser',
        data: {
            authorizedRoles: [USER_ROLES.user]
        },
        views: {
            'systemsetting-view': {
                templateUrl: 'app/src/system_settings/diagnosis/view/diagnosis-list.html',
                controller: 'DiagnosisController',
                controllerAs: 'vm'
            },
            'toolbar-tools-left@site': {
                template: "<h2>{{ 'ADMIN.ADMINISTRATION' | translate }} – Diagnoser</h2>"
            },
            'toolbar-tools-right@site': {
                templateUrl: 'app/src/system_settings/diagnosis/view/diagnosis-toolbar.html',
                controller: 'DiagnosisToolbarController',
                controllerAs: 'vm'
            }
        }
    })
    .state('administration.systemsettings.ethnicities', {
        url: '/etniciteter',
        data: {
            authorizedRoles: [USER_ROLES.user]
        },
        views: {
            'systemsetting-view': {
                templateUrl: 'app/src/system_settings/ethnicities/view/ethnicity-list.html',
                controller: 'EthnicityController',
                controllerAs: 'vm'
            },
            'toolbar-tools-left@site': {
                template: "<h2>{{ 'ADMIN.ADMINISTRATION' | translate }} – Etniciteter</h2>"
            },
            'toolbar-tools-right@site': {
                templateUrl: 'app/src/system_settings/ethnicities/view/ethnicity-toolbar.html',
                controller: 'EthnicityToolbarController',
                controllerAs: 'vm'
            }
        }
    })
    // .state('administration.systemsettings.notifications', {
    //     url: '/notifikationer',
    //     data: {
    //         authorizedRoles: [USER_ROLES.user]
    //     },
    //     views: {
    //         'systemsetting-view': {
    //             templateUrl: 'app/src/system_settings/notifications/view/notifications.html',
    //             controller: 'NotificationsSettingsController',
    //             controllerAs: 'vm'
    //         }
    //     }
    // })
    // .state('document_templates', {
    //     parent: 'site',
    //     url: 'projekter/DokumentSkabeloner',
    //     views: {
    //         'content@': {
    //             templateUrl: 'app/src/sites/view/site.html',
    //             controller: 'SiteController',
    //             controllerAs: 'vm'
    //         }
    //     },
    //     data: {
    //         authorizedRoles: [USER_ROLES.user],
    //         selectedTab: 0
    //     }

    // })
    // .state('administration.systemsettings.templateList', {
    //     url: '/skabeloner',
    //     data: {
    //         authorizedRoles: [USER_ROLES.admin]
    //     },
    //     views: {
    //         'systemsetting-view': {
    //             templateUrl: 'app/src/system_settings/templates/view/templateList.html',
    //             controller: 'TemplatesController',
    //             controllerAs: 'vm'
    //         }
    //     }
    // })
    // .state('administration.systemsettings.editTemplate', {
    //     url: '/skabelon',
    //     data: {
    //         authorizedRoles: [USER_ROLES.admin]
    //     },
    //     views: {
    //         'systemsetting-view': {
    //             templateUrl: 'app/src/system_settings/templates/view/editTemplate.html',
    //             controller: 'TemplatesController',
    //             controllerAs: 'vm'
    //         }
    //     }
    // });
}