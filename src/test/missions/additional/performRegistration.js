var myScreen = require('../../screens/my-screen.js');

module.exports = function performRegistration(cb){

	// use from context:
	var user = this.memory['userObj'];

	this.webDriver
		.waitForVisible(myScreen.registration.username.locator, 5000)
		.sendKeys(myScreen.registration.username.locator, user.username);
		.click(myScreen.registration.submitButton.locator)
		.call(cb);	
};