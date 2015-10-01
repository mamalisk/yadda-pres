'use strict';

var async = require('async');

module.exports.applyAll = function (webDriver){

    webDriver.addCommand('textIs', function(selector, text, cb) {
        this.selectorExecuteAsync(selector, function (elements, txt) {
            var cb = arguments[arguments.length - 1];
            var interval = setInterval(function () {
                for (var i = 0; i < elements.length; ++i) {
                    var elem = elements[i];
                        if (elem.innerHTML == txt) {
                            window.clearInterval(interval);
                            return cb(true);
                        }
                    }
            }, 100);
        }, text, cb);
    });

    webDriver.addCommand('textIsNot', function(selector, text, cb) {
        this.selectorExecuteAsync(selector, function (elements, txt) {
            var cb = arguments[arguments.length - 1];
            var interval = setInterval(function () {
                for (var i = 0; i < elements.length; ++i) {
                    var elem = elements[i];
                    if (elem.innerHTML !== txt) {
                        window.clearInterval(interval);
                        return cb(true);
                    }
                }
            }, 100);
        }, text, cb);
    });

    webDriver.addCommand('shiftClick', function(selector, cb){

        var shift = '\uE008';

        this.moveToObject(selector)
            .keys([shift])
            .click(selector)
            .keys([shift])
            .call(cb);
    });

    webDriver.addCommand('textContains', function(selector, text, cb) {
        this.selectorExecuteAsync(selector, function (elements, txt) {
            var cb = arguments[arguments.length - 1];
            var interval = setInterval(function () {
                for (var i = 0; i < elements.length; ++i) {
                    var elem = elements[i];
                        if (elem.innerHTML.indexOf(txt) > -1) {
                            window.clearInterval(interval);
                            return cb(true);
                        }
                    }
            }, 100);
        }, text, cb);
    });

    webDriver.addCommand('textDoesNotContain', function(selector, text, cb) {
        this.selectorExecuteAsync(selector, function (elements, txt) {
            var cb = arguments[arguments.length - 1];
            var interval = setInterval(function () {
                for (var i = 0; i < elements.length; ++i) {
                    var elem = elements[i];
                    if (elem.innerHTML.indexOf(txt) === -1 ) {
                        window.clearInterval(interval);
                        return cb(true);
                    }
                }
            }, 100);
        }, text, cb);
    });

    webDriver.addCommand('attributeContains', function(selector, attr, val, cb) {
        this.selectorExecuteAsync(selector, function (elements, attribute, value) {
            var cb = arguments[arguments.length - 1];
            var interval = setInterval(function () {
                for (var i = 0; i < elements.length; ++i) {
                    var elem = elements[i];
                    if (elem.getAttribute(attribute)) {
                        if (elem.getAttribute(attribute).indexOf(value) > -1) {
                            window.clearInterval(interval);
                            return cb(true);
                        }
                    }
                }
            }, 100);
        }, attr, val, cb);
    });

    webDriver.addCommand('attributeDoesNotContain', function(selector, attr, val, cb) {
        this.selectorExecuteAsync(selector, function (elements, attribute, value) {
            var cb = arguments[arguments.length - 1];
            var interval = setInterval(function () {
                for (var i = 0; i < elements.length; ++i) {
                    var elem = elements[i];
                    if (elem.getAttribute(attribute)) {
                        if (elem.getAttribute(attribute).indexOf(value) === -1) {
                            window.clearInterval(interval);
                            return cb(true);
                        }
                    }
                }
            }, 100);
        }, attr, val, cb);
    });

    webDriver.addCommand('canvasHasCompletedLoading', function(selector, cb){
        this.attributeDoesNotContain(selector,'class','loading', function(err){
            if(err){
                throw new Error('attribute still contained value');
            }
            cb();
        });
    });

    webDriver.addCommand('paneIntendState', function(selector,cb){
        this.attributeContains(selector,'class','frozen', function(err){
            if(err){
                throw new Error('pane did not enter intend state');
            }
            cb();
        });
    });




    webDriver.addCommand('waitForLoadingToComplete', function (selector, ms) {

        var callback = arguments[arguments.length - 1];

        if (typeof selector !== 'string') {
            return callback(new ErrorHandler.CommandError('number or type of arguments don\'t agree with waitForAttributeToContain command'));
        }

        /*!
         * ensure that ms is set properly
         */
        if (typeof ms !== 'number') {
            ms = this.options.waitforTimeout;
        }


        var self = this,
            response = {};

        async.waterfall([
            function (cb) {
                self.timeoutsAsyncScript(ms, cb);
            },
            function (res, cb) {
                response.timeoutsAsyncScript = res;
                self.isCanvasStillLoading(selector, cb);
            },
            function (result, res, cb) {
                response.selectorExecuteAsync = res;
                cb();
            }
        ], function (err) {

            callback(err, response.selectorExecuteAsync && response.selectorExecuteAsync.executeAsync ? response.selectorExecuteAsync.executeAsync.value : false, response);

        });


    });

    webDriver.addCommand('waitForCondition', function (ms, functionName) {

        var callback = arguments[arguments.length - 1];

        /*!
         * ensure that ms is set properly
         */
        if (typeof ms !== 'number') {
            ms = this.options.waitforTimeout;
        }
        var remainingArgs = Array.prototype.slice.call(arguments, 2, arguments.length-1);

        var self = this,
            response = {};
        var currentCallback = function(){};

        async.waterfall([
            function (cb) {
                self.timeoutsAsyncScript(ms, cb);
            },
            function (res, cb) {
                response.timeoutsAsyncScript = res;
                self[functionName](remainingArgs);
                callback();
            },
            function (result, res, cb) {
                response.selectorExecuteAsync = res;
                cb();
            }
        ], function (err) {

            callback(err, response.selectorExecuteAsync && response.selectorExecuteAsync.executeAsync ? response.selectorExecuteAsync.executeAsync.value : false, response);

        });


    });
}