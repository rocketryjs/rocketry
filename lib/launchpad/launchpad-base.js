/*
	Module: Launchpad base
	Description: The basic code all Launchpad devices have in class form to be enxtended
	TODO: Justify using this
*/
/*
	Module dependencies
*/
// Device class
const Device = require("../device-base.js");


/*
	Launchpad Class
*/
class Launchpad extends Device {
	constructor() {
		// Device, EventEmitter
		super(...arguments);

		// Method chaining
		return this;
	}


	static is(object) {
		return object instanceof this;
	}
}


module.exports = Launchpad;
