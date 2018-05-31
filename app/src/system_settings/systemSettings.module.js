'use strict';

angular
    .module('openDeskApp.systemsettings', ['ngMaterial', 'pascalprecht.translate'])
    .config(config);

function config($stateProvider,USER_ROLES) {

    $stateProvider.state('administration', {
        parent: 'site',
        url: '/administration',
        views: {
            'content@': {
                templateUrl: 'app/src/system_settings/system_settings.html',
                controller: 'SystemSettingsController',
                controllerAs: 'vm'
            }
        },
        params: {
            authorizedRoles: [USER_ROLES.admin, USER_ROLES.roleManager, USER_ROLES.propertyValueManager, USER_ROLES.templateFolderValueManager]
        },
        redirectTo: 'administration.dashboard'
    })
    .state('administration.dashboard', {
        views: {
            'systemsetting-view': {
                templateUrl: 'app/src/system_settings/dashboard/view/dashboard.html',
            }
        }
    })
    .state('administration.practitioners', {
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
    .state('administration.document_templates', {
        url: '/dokumentskabeloner',
        params: {
            authorizedRoles: [USER_ROLES.templateFolderValueManager],
            path: "/Sites/retspsyk/documentTemplates",
        },
        views: {
            'systemsetting-view': {
                templateUrl: 'app/src/system_settings/documentTemplates/documentTemplates.view.html',
            },
            'toolbar-tools-left@site': {
                template: "<h2>{{ 'ADMIN.ADMINISTRATION' | translate }} – Dokumentskabeloner</h2>"
            }
        }
    })
    .state('administration.ethnicities', {
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
        .state('administration.sanctions', {
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
        .state('administration.referingAgencies', {
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
        .state('administration.placement', {
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
        .state('administration.diagnosis', {
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
        .state('administration.mainCharge', {
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
        .state('administration.status', {
            url: '/status',
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
                    template: "<h2>{{ 'ADMIN.ADMINISTRATION' | translate }} – Status</h2>"
                },
                'toolbar-tools-right@site': {
                    templateUrl: 'app/src/system_settings/lists/view/list-toolbar.html',
                    controller: 'ListToolbarController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('administration.noDeclaration', {
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
        .state('administration.doctors', {
            url: '/laeger',
            params: {
                listTitle: 'Læge',
                listData: 'doctor',
                authorizedRoles: [USER_ROLES.propertyValueManager]
            },
            views: {
                'systemsetting-view': {
                    templateUrl: 'app/src/system_settings/lists/view/list.html',
                    controller: 'ListController',
                    controllerAs: 'vm'
                },
                'toolbar-tools-left@site': {
                    template: "<h2>{{ 'ADMIN.ADMINISTRATION' | translate }} – Læger</h2>"
                },
                'toolbar-tools-right@site': {
                    templateUrl: 'app/src/system_settings/lists/view/list-toolbar.html',
                    controller: 'ListToolbarController',
                    controllerAs: 'vm'
                }
            }
        }).state('administration.socialworkers', {
            url: '/socialraadgivere',
            params: {
                listTitle: 'Socialrådgiver',
                listData: 'socialworker',
                authorizedRoles: [USER_ROLES.propertyValueManager]
            },
            views: {
                'systemsetting-view': {
                    templateUrl: 'app/src/system_settings/lists/view/list.html',
                    controller: 'ListController',
                    controllerAs: 'vm'
                },
                'toolbar-tools-left@site': {
                    template: "<h2>{{ 'ADMIN.ADMINISTRATION' | translate }} – Socialrådgivere</h2>"
                },
                'toolbar-tools-right@site': {
                    templateUrl: 'app/src/system_settings/lists/view/list-toolbar.html',
                    controller: 'ListToolbarController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('administration.psychologists', {
            url: '/psykologer',
            params: {
                listTitle: 'Psykolog',
                listData: 'psychologist',
                authorizedRoles: [USER_ROLES.propertyValueManager]
            },
            views: {
                'systemsetting-view': {
                    templateUrl: 'app/src/system_settings/lists/view/list.html',
                    controller: 'ListController',
                    controllerAs: 'vm'
                },
                'toolbar-tools-left@site': {
                    template: "<h2>{{ 'ADMIN.ADMINISTRATION' | translate }} – Psykologer</h2>"
                },
                'toolbar-tools-right@site': {
                    templateUrl: 'app/src/system_settings/lists/view/list-toolbar.html',
                    controller: 'ListToolbarController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('administration.secretaries', {
            url: '/sekretaerer',
            params: {
                listTitle: 'Sekretær',
                listData: 'secretary',
                authorizedRoles: [USER_ROLES.propertyValueManager]
            },
            views: {
                'systemsetting-view': {
                    templateUrl: 'app/src/system_settings/lists/view/list.html',
                    controller: 'ListController',
                    controllerAs: 'vm'
                },
                'toolbar-tools-left@site': {
                    template: "<h2>{{ 'ADMIN.ADMINISTRATION' | translate }} – Sekretærer</h2>"
                },
                'toolbar-tools-right@site': {
                    templateUrl: 'app/src/system_settings/lists/view/list-toolbar.html',
                    controller: 'ListToolbarController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('administration.emailAuthorities', {
            url: '/myndigheder',
            params: {
                listTitle: 'Myndighed',
                listData: 'emailAuthorities',
                authorizedRoles: [USER_ROLES.propertyValueManager]
            },
            views: {
                'systemsetting-view': {
                    templateUrl: 'app/src/system_settings/lists/view/list.html',
                    controller: 'ListController',
                    controllerAs: 'vm'
                },
                'toolbar-tools-left@site': {
                    template: "<h2>{{ 'ADMIN.ADMINISTRATION' | translate }} – Myndigheder</h2>"
                },
                'toolbar-tools-right@site': {
                    templateUrl: 'app/src/system_settings/lists/view/list-toolbar.html',
                    controller: 'ListToolbarController',
                    controllerAs: 'vm'
                }
            }
        });
}