var Executor = require('./src/test/executor');

new Executor(
	'./src/test/features',
	'./steps/steps',
	'.yadda.json',
	['./missions/base','./missions/additional'],
	__dirname + '/src/'
);