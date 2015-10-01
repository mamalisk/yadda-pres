/* jslint node: true */
'use strict';

module.exports = (function(){

	var customConverters = require('./custom-converters'),
		Dictionary = require('yadda').Dictionary;

	var dictionary = new Dictionary()
		.define('onOff', /(on|off)/, customConverters.on_off_converter)
		.define('minMax', /(min|max)/, customConverters.on_off_converter)
		.define('integer', /(\d+)/, customConverters.integer_converter)
		;

	return require('./mixins')
						.yadda([

							'./navigation',
							'./action',
							'./verification'

						], dictionary);


})();