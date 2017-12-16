/*
	Module: Launchpad MK2
	Description: Class for the Launchpad MK2 device
*/
/*
	Module dependencies
*/
// Core
const core = require("../core.js");


/*
	Code sharing
*/
// Launchpad - parent device class
const Launchpad = require("./launchpad-base.js");
// All supported shared methods
const supports = ["rgb", "scroll-text", "midi-clock"];
const instanceMethods = core.requireShared(
	// All supported methods
	supports,
	// Path to find those methods
	"./launchpad/methods/"
);
const classMethods = core.requireShared(
	// All supported methods
	supports,
	// Path to find those methods
	"./launchpad/methods/static-"
);


/*
	Launchpad MK2 Class
*/
class Mk2 extends Launchpad {
	constructor() {
		// Launchpad, Device, EventEmitter
		super(...arguments);

		// Method chaining with shared methods
		return core.addShared(this, instanceMethods);
	}


	static get sysex() {
		return {
			"prefix": [240, 0, 32, 41, 2, 24],
			"suffix": 247
		};
	}
	static get name() {
		return "Launchpad MK2";
	}
	static get regex() {
		return `^(?:[\\d-]*\\s+)?(${this.name})`;
	}
	static is(object) {
		return object instanceof this;
	}
}


// Export class with shared static methods
module.exports = core.addShared(Mk2, classMethods);
