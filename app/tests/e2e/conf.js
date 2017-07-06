exports.config = {
    capabilities: {'browserName': 'chrome'},

    /*multiCapabilities: [
     {'browserName': 'chrome'},
     {'browserName': 'firefox'},
     {'browserName': 'opera'},
     {'browserName': 'safari'}
     ],*/

    //allScriptsTimeout: 30000,
    rootElement: "body",

    framework: 'jasmine2',
    jasmineNodeOpts: {
        showColors: true,
        isVerbose: true,
        includeStackTrace: true},
    seleniumPort: 4840,

    /* Due to issues with slow Selenium startup due to RNG, see http://stackoverflow.com/questions/14058111/selenium-server-doesnt-bind-to-socket-after-being-killed-with-sigterm. */
    //seleniumArgs: ["-Djava.security.egd=file:/dev/./urandom"],

    onPrepare: function () {


        browser.get('http://localhost:8000/#!/erklaeringer');
        browser.getCapabilities().then(function (capabilities) {
            browser.capabilities = capabilities;
        });

        browser.params.loginDetails = (function () {
            // Load the username/password to use from a config file located
            // in the parent directory of the OpenESDH-UI root
            try {
                return require('../../../../loginDetails.json');
            } catch (e) {
                return { 'admin' : {'username': 'admin', 'password': 'admin'} };
            }
        })();

    },
    suites: {
        login: './login/*.test.js',
        declarations: './declarations/*.test.js'
    }
};
