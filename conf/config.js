exports.config = {
    directConnect: process.env.DIRECT_CONNECT || true,

    capabilities: {
        browserName: 'chrome',
        platform: 'ANY',
        version: ''
    },

    baseUrl:
        (process.env.HTTP_PROTOCOL || 'http://') +
        (process.env.HTTP_HOST || 'localhost') +
        (process.env.HTTP_PORT ? ':' + process.env.HTTP_PORT : ':3000'),

    framework: 'mocha',
    mochaOpts: {
        reporter: 'spec',
        timeout: 5000
    },

    specs: ['../dist/**/*spec.js']
};
