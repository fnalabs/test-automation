exports.config = {
    directConnect: process.env.DIRECT_CONNECT || false,

    seleniumAddress: process.env.SELENIUM_URL || 'http://localhost:4444/wd/hub',

    capabilities: {
        browserName: process.env.TEST_BROWSER_NAME || 'phantomjs',
        version: process.env.TEST_BROWSER_VERSION || 'ANY',

        'phantomjs.binary.path': require('phantomjs').path,
        'phantomjs.ghostdriver.cli.args': ['--loglevel=DEBUG']
    },

    baseUrl:
        (process.env.HTTP_PROTOCOL || 'http://') +
        (process.env.HTTP_HOST || 'localhost') +
        (':' + process.env.HTTP_PORT || ':3000'),

    framework: 'mocha',
    mochaOpts: {
        reporter: 'spec',
        timeout: 5000
    },

    specs: [
        './**/*spec.js',
        '!./node_modules/**/*',
        '!./bower_components/**/*'
    ]
};
