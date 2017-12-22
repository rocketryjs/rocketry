/*
	Module: Launchpad MK2 Button
	Description: The button class for the Launchpad MK2
*/
/*
	Module dependencies
*/
// Button
const Button = require("./button.js");
// Core
const core = require("../../core.js");


/*
	Code sharing
*/
const supports = ["rgb"];
const instanceMethods = core.requireShared(
	// All supported methods
	supports,
	// Path to find those methods
	"./launchpad/button/methods/"
);


/*
	Launchpad MK2 Button Class
*/
class LaunchpadMk2Button extends Button {
	constructor() {
		// Button, EventEmitter
		super(...arguments);

		// Shared instance methods
		core.addShared(this, instanceMethods);
	}
}


// Export
module.exports = LaunchpadMk2Button;
