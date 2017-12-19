/*
	Module: Buttons base
	Description: The basic code all Buttons have in class form to be enxtended
*/
/*
	Module dependencies
*/
// Node Events
const EventEmitter = require("events");
// Button
const Button = require("./button-base.js");


const proto = {
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
		return "Buttons";
	}
};


module.exports = function(device, ...values) {
	// Constructor
	const buttons = [];
	for (const value of values) {
		buttons.push(new Button(device, value));
	}
	buttons.device = device;


	// Prototyping
	return Object.setPrototypeOf(
		// this => array of `Button`s
		buttons,
		// Prototype
		Object.setPrototypeOf(
			// Methods
			proto,
			// Event emitter extension
			EventEmitter.prototype
		)
	);
};
