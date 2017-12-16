/*
	Module: Buttons base
	Description: The basic code all Buttons have in class form to be enxtended
*/
/*
	Module dependencies
*/
// Node Events
const EventEmitter = require("events");
/// Button
const Button = require("./button-base.js");


class Buttons extends EventEmitter {
	constructor(device, ...values) {
		// EventEmitter
		super();

		this.device = device;

		// Button instances
		if (device.buttons) {
			// Get from device's stored buttons if there is any
			for (let i = 0; i < values.length; i++) {
				this[i] = device.buttons.get(values[i]);
			}
		} else {
			// Get using new Button()
			for (let i = 0; i < values.length; i++) {
				this[i] = new Button(this.device, values[i]);
			}
		}
	}


	get(value) {
		const results = [];

		for (const button of this) {
			const matched = button.test(value);
			if (matched) {
				results.push(button);
			}
		}

		return results ? results : undefined;
	}


	get buttons() {
		const results = [];

		for (const key in this) {
			if (/\d+/i.test(key)) {
				results.push(this[key]);
			}
		}

		return results;
	}


	// Iterator for use in for loops and spread syntax
	* [Symbol.iterator]() {
		for (const button of this.buttons) {
			yield button;
		}
	}


	// this.toString => [object Buttons]
	get [Symbol.toStringTag]() {
		return "Buttons";
	}


	static is(object) {
		return object instanceof this;
	}
}


module.exports = Buttons;
