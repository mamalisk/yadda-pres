module.exports = function navigateToGoogle(cb){
	
	this.webDriver
		.url('http://www.google.co.uk')
		.call(cb);
};