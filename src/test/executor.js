/* jslint node: true */
/* global before, afterEach, after, featureFile, scenarios, steps */

module.exports = function Executor(featuresLocation, stepDefinitionsLocation, reportsOutputLocation, extendedMissionsLocations, configurationLocation) {

    "use strict";
    var Yadda = require('yadda');
    Yadda.plugins.mocha.StepLevelPlugin.init();
    var gutil = require('gulp-util');
    var webdriver = require('webdriverio');
    var library = require(stepDefinitionsLocation);
    var Agent = require('../core/agent');
    var winston = require('winston');

    var scriptsHelper = require('./webdriver/extensions.js');
    var webDriver;
    var context;
    var agent = new Agent();
    var AgentConfiguration = require('./config.js');
    var config = new AgentConfiguration(configurationLocation).get();
    var tools = config.get('tools');
    var webDriverConfig = tools[0].config;
    var _ = require('underscore');
    var args = require('yargs').argv;

    agent.extendWith(['./missions/webdriver'], __dirname);
    agent.extendWith(extendedMissionsLocations, __dirname);

    var YaddaHtml = require('./yadda-mocha-html-reporter');
    // var YaddaHtml = require('yaddi');
    var YaddaHtmlRep = new YaddaHtml(reportsOutputLocation);




    var foundFeatureFilesNumber = new Yadda.FeatureFileSearch(featuresLocation).list().length;

    gutil.log(foundFeatureFilesNumber + ' feature files found');


    new Yadda.FeatureFileSearch(featuresLocation).each(function (file) {


        featureFile(file, function (feature) {
            if(args.feature){
                var featureToRun = args.feature;
                if(featureToRun.indexOf('@') > -1) featureToRun = featureToRun.replace('@','');
                if(!feature.annotations.hasOwnProperty(featureToRun)){
                    return;
                }
            }
            var featureToRun = feature;
            YaddaHtmlRep.onFeature(featureToRun);

            before(function (done) {
                YaddaHtmlRep.onBefore();
                if (!webDriver) {
                    webDriver = webDriver || webdriver.remote(webDriverConfig);
                    webDriver.init();
                    webDriver.windowHandleSize({width: 1000, height: 800});
                }
                scriptsHelper.applyAll(webDriver);
                agent.setDriver(webDriver);
                agent.withLogger(winston);
                context = {
                    evolveFxUser: agent,
                    hasSwapsSwitchedOn : false
                };
                done();
            });

            beforeEach(function () {
                YaddaHtmlRep.onBeforeEach();
            });


            var yadda = new Yadda.Yadda(library, context);
            scenarios(feature.scenarios, function (scenario) {
               if(args.scenario){
                   var scenarioToRun = args.scenario;
                   if(scenarioToRun.indexOf('@') > -1) scenarioToRun = scenarioToRun.replace('@','');
                   if(!scenario.annotations.hasOwnProperty(scenarioToRun)){
                       return;
                   }
               }
                steps(scenario.steps, function (step, done) {
                    YaddaHtmlRep.onStep(scenario);
                    yadda.run(step, context, done);
                });
            });

            afterEach(function () {
                takeScreenshotOnFailure(this.currentTest);
                YaddaHtmlRep.onAfterEach(this.currentTest);
            });

            after(function (done) {
                YaddaHtmlRep.onAfter(featureToRun);
                if (YaddaHtmlRep.executedFeatures == foundFeatureFilesNumber) {
                    gutil.log('killing browser');
                    webDriver.end(done);
                } else {
                    done();
                }
            });

        });
    });


    function takeScreenshotOnFailure(test) {
        if (test.state != 'passed') {
            agent.narrate(test.title + ' failed', 'error');
            var path = './reporter/' + test.title.replace(/\W+/g, '_').toLowerCase() + '.png';
            YaddaHtmlRep.currentScenarioScreenshot = path;
            webDriver.saveScreenshot(path);
        } else {
            agent.narrate(test.title + ' passed', 'info');
        }
    }


};