#!/usr/bin/env node
var PACKAGE = require('./node_modules/js-auto-test/package');

var exec = require('child_process').exec;
var program = require('commander');

var configFile = './node_modules/js-auto-test/config/config.js';

program
    .version(PACKAGE.version)
    .arguments('[config]')
    .action(function (config) {
        if (config) { configFile = config; }

        exec('node ./node_modules/protractor/bin/protractor ' + configFile,
            function (error, stdout, stderr) {
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            }
        );
    })
    .parse(process.argv);
