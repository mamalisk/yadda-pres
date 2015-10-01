'use strict';

var ScreenElement = function(alias, locator){
    this.locator = locator;
    this.alias = alias;
    this.defaultValue = "";
}

ScreenElement.prototype.withDefaultValue = function(defaultValue) { this.defaultValue = defaultValue; return this; }

exports = module.exports = ScreenElement;