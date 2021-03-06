'use strict';

angular
    .module('openDeskApp.backendConfig', [])
    .constant('APP_BACKEND_CONFIG', {
        enableProjects: false,
        enableESDH: false,
        enableChat: false,
        dashboardLinks: {
            calendar:"",
            keyNumbers:"",
            projects:"#!/projekter",
            intra:"",
            workTime:"",
            esdh:"",
            map:"",
            email:"",
            citrix:""
        },
        public: {
            appName: "OpenDesk"
        }
    });