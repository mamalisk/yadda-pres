'use strict'

var Screen = function (name, screenElementsArray, screensArray) {
    this.self = this;
    this.name = name;
    this.url = "/";
    if(screenElementsArray){
        for(var i in screenElementsArray){
            this[screenElementsArray[i].alias] = screenElementsArray[i];
        }
    }

    if(screensArray) {
        for (var j in screensArray) {
            this[screensArray[j].name] = screensArray[j];
        }
    }
};

Screen.prototype.withScreenElement = function(screenElement) {
    this[screenElement.alias] = screenElement;
    return this;
};

Screen.prototype.withSubScreen = function(screen) {
    this[screen.name] = screen;
    return this;
};

Screen.prototype.element = function(screenAlias){
    return this.screenElements[screenAlias];
};

Screen.prototype.subScreen = function(screenAlias){
    return this[screenAlias];
}


Screen.prototype.withUrl = function(url) { this.url = url; return this; }


module.exports = Screen;