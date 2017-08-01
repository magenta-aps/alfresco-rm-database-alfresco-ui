angular
    .module('openDeskApp.systemsettings', ['ngMaterial', 'pascalprecht.translate'])
    .config(config);

function config(systemSettingsPagesServiceProvider, $stateProvider,USER_ROLES) {
    systemSettingsPagesServiceProvider.addPage('Projektskabeloner', 'administration.systemsettings.templateList', true);
    systemSettingsPagesServiceProvider.addPage('Dokumentskabeloner', 'document_templates', true);

    $stateProvider.state('administration.systemsettings', {
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
        views: {
            'systemsetting-view': {
                templateUrl: 'app/src/system_settings/dashboard/view/dashboard.html',
            }
        }
    })
    .state('administration.systemsettings.practitioners', {
        url: '/brugerrettigheder',
        views: {
            'systemsetting-view': {
                templateUrl: 'app/src/system_settings/practitioners/view/practitioner-list.html',
                controller: 'PractitionerController',
                controllerAs: 'vm'
            },
            'toolbar-tools-left@site': {
                template: "<h2>{{ 'ADMIN.ADMINISTRATION' | translate }} – Brugerrettigheder</h2>"
            },
            'toolbar-tools-right@site': {
                templateUrl: 'app/src/system_settings/practitioners/view/practitioner-toolbar.html',
                controller: 'PractitionerToolbarController',
                controllerAs: 'vm'
            }
        },
        params: {
            authorizedRoles: [USER_ROLES.roleManager]
        }
    })
    .state('administration.systemsettings.ethnicities', {
        url: '/etniciteter',
        params: {
            listTitle: 'Etnicitet',
            listData: 'ethnicity',
            authorizedRoles: [USER_ROLES.propertyValueManager]
        },
        views: {
            'systemsetting-view': {
                templateUrl: 'app/src/system_settings/lists/view/list.html',
                controller: 'ListController',
                controllerAs: 'vm'
            },
            'toolbar-tools-left@site': {
                template: "<h2>{{ 'ADMIN.ADMINISTRATION' | translate }} – Etniciteter</h2>"
            },
            'toolbar-tools-right@site': {
                templateUrl: 'app/src/system_settings/lists/view/list-toolbar.html',
                controller: 'ListToolbarController',
                controllerAs: 'vm'
            }
        },
    })
        .state('administration.systemsettings.sanctions', {
            url: '/sanktioner',
            params: {
                listTitle: 'Sanktion',
                listData: 'sanctionProposal',
                authorizedRoles: [USER_ROLES.propertyValueManager]
            },
            views: {
                'systemsetting-view': {
                    templateUrl: 'app/src/system_settings/lists/view/list.html',
                    controller: 'ListController',
                    controllerAs: 'vm'
                },
                'toolbar-tools-left@site': {
                    template: "<h2>{{ 'ADMIN.ADMINISTRATION' | translate }} – Sanktioner</h2>"
                },
                'toolbar-tools-right@site': {
                    templateUrl: 'app/src/system_settings/lists/view/list-toolbar.html',
                    controller: 'ListToolbarController',
                    controllerAs: 'vm'
                }
            },
        })
        .state('administration.systemsettings.referingAgencies', {
            url: '/henvisende-instanser',
            params: {
                listTitle: 'Henvisende instans',
                listData: 'referingAgency',
                authorizedRoles: [USER_ROLES.propertyValueManager]
            },
            views: {
                'systemsetting-view': {
                    templateUrl: 'app/src/system_settings/lists/view/list.html',
                    controller: 'ListController',
                    controllerAs: 'vm'
                },
                'toolbar-tools-left@site': {
                    template: "<h2>{{ 'ADMIN.ADMINISTRATION' | translate }} – Henvisende instanser</h2>"
                },
                'toolbar-tools-right@site': {
                    templateUrl: 'app/src/system_settings/lists/view/list-toolbar.html',
                    controller: 'ListToolbarController',
                    controllerAs: 'vm'
                }
            },
        })
        .state('administration.systemsettings.placement', {
            url: '/placeringer',
            params: {
                listTitle: 'Placering',
                listData: 'placement',
                authorizedRoles: [USER_ROLES.propertyValueManager]
            },
            views: {
                'systemsetting-view': {
                    templateUrl: 'app/src/system_settings/lists/view/list.html',
                    controller: 'ListController',
                    controllerAs: 'vm'
                },
                'toolbar-tools-left@site': {
                    template: "<h2>{{ 'ADMIN.ADMINISTRATION' | translate }} – Placeringer</h2>"
                },
                'toolbar-tools-right@site': {
                    templateUrl: 'app/src/system_settings/lists/view/list-toolbar.html',
                    controller: 'ListToolbarController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('administration.systemsettings.diagnosis', {
            url: '/diagnoser',
            params: {
                listTitle: 'Diagnose',
                listData: 'diagnosis',
                authorizedRoles: [USER_ROLES.propertyValueManager]
            },
            views: {
                'systemsetting-view': {
                    templateUrl: 'app/src/system_settings/lists/view/list.html',
                    controller: 'ListController',
                    controllerAs: 'vm'
                },
                'toolbar-tools-left@site': {
                    template: "<h2>{{ 'ADMIN.ADMINISTRATION' | translate }} – Diagnoser</h2>"
                },
                'toolbar-tools-right@site': {
                    templateUrl: 'app/src/system_settings/lists/view/list-toolbar.html',
                    controller: 'ListToolbarController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('administration.systemsettings.mainCharge', {
            url: '/sigtelser',
            params: {
                listTitle: 'Sigtelse',
                listData: 'mainCharge',
                authorizedRoles: [USER_ROLES.propertyValueManager]
            },
            views: {
                'systemsetting-view': {
                    templateUrl: 'app/src/system_settings/lists/view/list.html',
                    controller: 'ListController',
                    controllerAs: 'vm'
                },
                'toolbar-tools-left@site': {
                    template: "<h2>{{ 'ADMIN.ADMINISTRATION' | translate }} – Sigtelser</h2>"
                },
                'toolbar-tools-right@site': {
                    templateUrl: 'app/src/system_settings/lists/view/list-toolbar.html',
                    controller: 'ListToolbarController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('administration.systemsettings.status', {
            url: '/statusser',
            params: {
                listTitle: 'Status',
                listData: 'status',
                authorizedRoles: [USER_ROLES.propertyValueManager]
            },
            views: {
                'systemsetting-view': {
                    templateUrl: 'app/src/system_settings/lists/view/list.html',
                    controller: 'ListController',
                    controllerAs: 'vm'
                },
                'toolbar-tools-left@site': {
                    template: "<h2>{{ 'ADMIN.ADMINISTRATION' | translate }} – Statusser</h2>"
                },
                'toolbar-tools-right@site': {
                    templateUrl: 'app/src/system_settings/lists/view/list-toolbar.html',
                    controller: 'ListToolbarController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('administration.systemsettings.noDeclaration', {
            url: '/afsluttet-uden-erklaering',
            params: {
                listTitle: 'Årsag',
                listData: 'noDeclarationReason',
                authorizedRoles: [USER_ROLES.propertyValueManager]
            },
            views: {
                'systemsetting-view': {
                    templateUrl: 'app/src/system_settings/lists/view/list.html',
                    controller: 'ListController',
                    controllerAs: 'vm'
                },
                'toolbar-tools-left@site': {
                    template: "<h2>{{ 'ADMIN.ADMINISTRATION' | translate }} – Afsluttet uden erklæring</h2>"
                },
                'toolbar-tools-right@site': {
                    templateUrl: 'app/src/system_settings/lists/view/list-toolbar.html',
                    controller: 'ListToolbarController',
                    controllerAs: 'vm'
                }
            }
        })
}