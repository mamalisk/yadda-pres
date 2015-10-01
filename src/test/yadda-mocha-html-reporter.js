var _ = require('underscore'),
    gutil = require('gulp-util');

var YaddaHtmlReporter = function(reportsOutputLocation){
    this.featureFiles = {
        features: [],
        passedScenarios: 0,
        failedScenarios: 0,
        ignoredScenarios: 0
    };

    this.reportsOutputLocation = reportsOutputLocation;

    this.totalScenarios = 0;
    this.totalFeatures = 0;

    this.currentScenarioName = "";
    this.currentSteps = [];
    this.currentStatus = "not_executed";
    this.currentScenarioTags = [];
    this.currentScenarioScreenshot = "";

    this.executedFeatures = 0;
};

YaddaHtmlReporter.prototype.onFeature = function(feature){
    this.reportingFeature = {
        scenarios: [],
        name : feature.title,
        descriptionLines : feature.description,
        status : 'not_executed',
        tags : Object.keys(feature.annotations)
    };
    this.totalFeatures++;
    this.totalScenarios += feature.scenarios.length;
    //this.reportingFeature.name =  '' + feature.title;
    //this.reportingFeature.descriptionLines = '' + feature.description;
    //this.reportingFeature.status = "not_executed";
    //this.reportingFeature.tags = Object.keys(feature.annotations);
    this.executedScenarios = [];
};

YaddaHtmlReporter.prototype.onBefore = function(){
    this.currentScenarioName = "";
    this.currentSteps = [];
    this.currentScenarioTags = [];
    this.currentScenarioScreenshot = "";
    this.executedScenarios = [];
};

YaddaHtmlReporter.prototype.onBeforeEach = function(){
    if (this.currentStatus == 'failed') {
        this.reportingFeature.status = 'failed';
        this.featureFiles.failedScenarios++;
        this.featureFiles.passedScenarios--;
    }
};

YaddaHtmlReporter.prototype.onStep = function(scenario){
    var foundScenario = _.find(this.executedScenarios, function (sc) {
        return sc.name == scenario.title;
    });
    if (!foundScenario) {
        this.executedScenarios.push({
            name: scenario.title,
            status: 'not_executed',
            tags: Object.keys(scenario.annotations)
        })
    }
    if (this.currentScenarioName != scenario.title) {
        this.currentScenarioName = scenario.title;
        this.currentStatus = "not_executed";
        this.currentScenarioTags = Object.keys(scenario.annotations);
    }
};

YaddaHtmlReporter.prototype.onAfterEach = function(currentTest){
    this.currentStatus = currentTest.state;

    if(currentTest.state == 'failed'){
        this.error = currentTest.err.message;
    }

    var currentScenarioName = this.currentScenarioName;

    var foundScenario = _.find(this.executedScenarios, function (scenario) {
        return scenario.name == currentScenarioName;
    });
    if (foundScenario) {
        var existingSteps = foundScenario.steps || [];
        existingSteps.push({
            name: currentTest.title,
            status: currentTest.state
        });
        this.executedScenarios.pop();
        this.executedScenarios.push({
            name: this.currentScenarioName,
            status: this.currentStatus,
            tags: this.currentScenarioTags,
            screenshot: this.currentScenarioScreenshot,
            error: this.error,
            steps: existingSteps
        })
    } else {
        this.executedScenarios.push({
            name: this.currentScenarioName,
            status: this.currentStatus,
            tags: this.currentScenarioTags,
            screenshot: this.currentScenarioScreenshot,
            error: this.error,
            steps: [currentTest.title]
        })
    }

    this.currentSteps.push({
        name: currentTest.title,
        status: currentTest.state
    });
};



YaddaHtmlReporter.prototype.onAfter = function(feature){
    this.executedFeatures++;

    if (this.reportingFeature.status == 'passed' || this.reportingFeature.status == 'not_executed') {
        this.reportingFeature.status = this.currentStatus;
    }
    this.reportingFeature.scenarios = this.executedScenarios;

    var passed = _.filter(this.executedScenarios, function (scenario) {
        return scenario.status == 'passed';
    });

    var failed = _.filter(this.executedScenarios, function (scenario) {
        return scenario.status == 'failed';
    });

    var ignored = _.filter(this.executedScenarios, function (scenario) {
        return scenario.status == 'not_executed' || scenario.status == 'ignored';
    });

    this.featureFiles.features.push({
        name : feature.title,
        status : this.reportingFeature.status,
        tags : feature.annotations,
        descriptionLines : feature.description,
        scenarios : this.reportingFeature.scenarios
    });

    this.featureFiles.totalFeatures = this.totalFeatures;
    this.featureFiles.totalScenarios = this.totalScenarios;

    if (passed) {
        this.featureFiles.passedScenarios += passed.length;
    }
    if (failed) {
        this.featureFiles.failedScenarios += failed.length;
    }
    if (ignored) {
        this.featureFiles.ignoredScenarios += ignored.length;
    }

    gutil.log('about to save report at ' + this.reportsOutputLocation);
    require('fs-extra').writeJsonSync(this.reportsOutputLocation, this.featureFiles);
    gutil.log('saved report');
    var yaddaJsonFileContent = require('fs-extra').readJsonSync(this.reportsOutputLocation, {throws: false});
    gutil.log(yaddaJsonFileContent);
};

YaddaHtmlReporter.prototype.yaddaToJson = function(file, features, cb){
    require('jsonfile').writeFile(file, features, function(err){
        if(err){
            gutil.log(err);
            return cb(err);
        } else {
            gutil.log('Successfully saved features in ' + file, 'info');
            cb();
        }
    });
};

module.exports = YaddaHtmlReporter;
