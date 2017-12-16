/*
	Module: Launchpad MK2
	Description: Class for the Launchpad MK2 device
*/
/*
	Module dependencies
*/
// Core
const core = require("../core.js");
/// Buttons
const Buttons = require("./button/buttons-base.js");


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
class LaunchpadMk2 extends Launchpad {
	constructor() {
		// Launchpad, Device, EventEmitter
		super(...arguments);
		// Shared instance methods
		core.addShared(this, instanceMethods);

		// Buttons
		this.buttons = this.getAll();
	}


	get(...values) {
		// TODO
		return new Buttons(this, ...values);
	}
	getColumn() {
		// TODO
		return new Buttons(this, ...values);
	}
	getRow() {
		// TODO
		return new Buttons(this, ...values);
	}
	getQuadrant() {
		// TODO
		return new Buttons(this, ...values);
	}
	getGrid() {
		// TODO
		return new Buttons(this, ...values);
	}
	getAll() {
		// TODO
		const values = [{
			"note": 11
		}, {
			"name": "user 1",
			"note": 12
		}];
		return this.buttons ? this.buttons : new Buttons(this, ...values);
	}


	setToBootloader() {
		return this.send([240, 0, 32, 41, 0, 113, 0, 105, 247]);
	}


	get deviceId() {
		const deviceName = core.getDeviceName(
			this.input,
			this.output,
			this.portNums.input,
			this.portNums.output
		);
		const match = deviceName.match(/^(?:(\d+)-?\s+)?.*?(?:\s+(\d+))?$/);
		if (match && match[1]) {
			// Example: "6- Launchpad MK2" means the device ID is 1
			return 1;
		} else if (match && match[2]) {
			// Example: "Launchpad MK2 5" means the device ID is 5
			return parseInt(match[2]);
		} else {
			// Can't find value in device name
			return undefined;
		}
	}


	static get buttons() {
		return {

		};
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
		return `^(?:\\d+-?\\s+)?(${this.name})(?:\\s+\\d+)?$`;
	}
	static is(object) {
		return object instanceof this;
	}
}


// Export class with shared static methods
module.exports = core.addShared(LaunchpadMk2, classMethods);
