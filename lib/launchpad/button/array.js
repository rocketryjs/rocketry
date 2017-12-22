/*
	Module: Button array
	Description: The button array constructor that makes an array with instance methods
*/
/*
	Module dependencies
*/
// Node Events
const EventEmitter = require("events");


const prototype = {
	get(value) {
		const results = [];

		for (const button of this) {
			const matched = button.test(value);
			if (matched) {
				results.push(button);
			}
		}

		return results ? results : undefined;
	},


	get buttons() {
		const results = [];

		for (const key in this) {
			if (/\d+/i.test(key)) {
				results.push(this[key]);
			}
		}

		return results;
	},


	// Iterator for use in for loops and spread syntax
	* [Symbol.iterator]() {
		// Get all keys
		for (const key in this) {
			// Only yield keys that are digits in the key string
			if (/^\d+$/i.test(key)) {
				yield this[key];
			}
		}
	},


	// this.toString => [object Buttons]
	get [Symbol.toStringTag]() {
		return "ButtonArray";
	}
};


module.exports = function(device, ...values) {
	// Constructor
	const buttons = [];
	if (device.buttons) {
		for (const value of values) {
			buttons.push(...device.buttons.get(value));
		}
	} else {
		for (const value of values) {
			buttons.push(new device.constructor.Button(device, value));
		}
	}
	buttons.device = device;


	// Each methods
	// TODO: better
	for (const key in device.constructor.Button) {
		buttons[key] = function() {
			const result = [];

			for (const button of this) {
				result.push(button[key + "Each"](...arguments));
			}

			return result;
		}
	}


	// Prototyping
	return Object.setPrototypeOf(
		// this => array of `Button`s
		buttons,
		// Prototype
		Object.setPrototypeOf(
			// Methods
			prototype,
			// Event emitter extension
			EventEmitter.prototype
		)
	);
};
