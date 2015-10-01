var Executor = require('./src/test/executor');

new Executor(
	'./src/test/features',
	'./steps/steps',
	['./missions/base','./missions/additional'],
	__dirname + '/'
);