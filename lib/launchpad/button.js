/*
	Module: Button base
	Description: The basic code all buttons have in class form to be extended
*/
/*
	Module dependencies
*/
// lodash
const _ = require("lodash");
// SubEmitter
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
		return _.isMatch(this, object);
	}


	// Determine if the emitter should emit
	willEmit(event, message) {
		if (event === "press" || event === "release") {
			return this.note === message.note;
		}
	}


	// this.toString => [object Button]
	get [Symbol.toStringTag]() {
		return "Button";
	}


	static is(object) {
		return object instanceof this;
	}
}


module.exports = Button;
