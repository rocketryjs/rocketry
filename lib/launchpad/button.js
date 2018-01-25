/*
	Module: Button base
	Description: The basic code all buttons have in class form to be extended
*/
/*
	Module dependencies
*/
const _ = require("lodash");
const SubEmitter = require("./sub-emitter.js");


class Button extends SubEmitter {
	constructor(device, object) {
		// EventEmitter
		super();

		this.device = device;

		// Assign note, coords, name, etc
		Object.assign(this, object);
	}


	test(object) {
		// Test against functions
		for (const key in this) {
			const hasFunction = typeof this[key] === "function";
			const hasTestValue = typeof object[key] !== "undefined";
			if (hasFunction && hasTestValue) {
				// Match against running function with defaults
				const funcMatch = _.isMatch(this[key](), object[key]);
				// Don't test using isMatch not that it was tested here
				delete object[key];
				if (!funcMatch) {
					return false;
				}
			}
		}

		// Test properties
		return _.isMatch(this, object);
	}


	// Determine if the emitter should emit
	willEmit(event, message) {
		if (event === "press" || event === "release") {
			return this.note === message.note;
		}
	}


	static is(object) {
		return object instanceof this;
	}
}


module.exports = Button;
