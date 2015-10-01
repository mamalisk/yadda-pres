module.exports = function navigateToGoogle(cb){
	
	this.webDriver.url(function (err, res){
		if(err) return cb(err);
		cb();
	})
}