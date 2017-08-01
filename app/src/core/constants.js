angular
    .module('openDeskApp.core')
    .constant('USER_ROLES', {
        admin: 'admin',
        user: 'user',
        guest: 'guest',
        roleManager: 'SiteRoleManager',
        entryLockManager: 'SiteEntryLockManager'
    })
    .constant('ALFRESCO_URI', {
        apiProxy: '/alfresco/api/',
        serviceApiProxy: '/api/',
        serviceSlingshotProxy: '/slingshot/'
    });