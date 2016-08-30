var DEPENDENT_ROOT = '../../../';
var WEB_SERVER_DEFAULT_PORT = 8081;

exports.config = {
    directConnect: process.env.DIRECT_CONNECT || false,

    seleniumAddress: process.env.SELENIUM_URL || 'http://localhost:4444/wd/hub',

    capabilities: {
        browserName: process.env.TEST_BROWSER_NAME || 'phantomjs',
        version: process.env.TEST_BROWSER_VERSION || 'ANY',

        'phantomjs.binary.path': require('phantomjs').path,
        'phantomjs.ghostdriver.cli.args': ['--loglevel=DEBUG']
    },

    webServerDefaultPort: process.env.WEB_SERVER_DEFAULT_PORT || WEB_SERVER_DEFAULT_PORT,
    interactiveTestPort: process.env.INTERACTIVE_TEST_PORT || 6969,

    baseUrl:
        (process.env.HTTP_PROTOCOL || 'http://') +
        (process.env.HTTP_HOST || 'localhost') +
        (':' + process.env.HTTP_PORT || ''),

    framework: 'mocha',
    mochaOpts: {
        reporter: 'spec',
        timeout: 4000
    },

    specs: [
        DEPENDENT_ROOT + '**/*spec.js',
        '!' + DEPENDENT_ROOT + 'node_modules/**/*',
        '!' + DEPENDENT_ROOT + 'bower_components/**/*'
    ]
};
