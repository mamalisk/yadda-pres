'use strict';

var Mixins = function(){}

Mixins.prototype.single = function(a, b) {
    var keys = Object.keys(b);
    var key;
    for (var i = 0, l = keys.length; i < l; i += 1) {
        key = keys[i];
        if ('object' === typeof a[key])
            a[key] = mixin(a[key], b[key]);
        else
            a[key] = b[key];
    }
    return a;
}

Mixins.prototype.multiple = function(a, b) {
   if(b instanceof Array){
       for(var i=0; i < b.length; i++){
          a = this.single(a,b[i]);
       }
       return a;
   } else {
      return this.single(a, b);
   }
}

Mixins.prototype.yadda = function(arrayOfSteps, primedDictionary){

    if(!arrayOfSteps) return rootLibrary;
    if(!(arrayOfSteps instanceof Array)){
        throw Error('passed array is not a list of steps');
    }
    var yaddaLibrary = { dictionary : require('yadda').localisation.English.library(primedDictionary)  } ;
    for(var i=0; i < arrayOfSteps.length; i++){
        var Required = require(arrayOfSteps[i]);
        yaddaLibrary = new Required(yaddaLibrary);
    }
    return yaddaLibrary.dictionary;
}

module.exports = new Mixins();