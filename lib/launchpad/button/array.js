/*
	Module: Button array
	Description: The button array constructor that makes an array with instance methods
*/
/*
	Module dependencies
*/
// Node Events
const EventEmitter = require("events");
// lodash
const _ = require("lodash");
// Button
const Button = require("./button.js");


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

	// Extend EventEmitter methods
	addListener() {
		const result = super.addListener(...arguments);
		this.updateListeners();

		return result;
	},
	on() {
		const result = super.on(...arguments);
		this.updateListeners();

		return result;
	},
	once() {
		const result = super.once(...arguments);
		this.updateListeners();

		return result;
	},
	prependListener() {
		const result = super.prependListener(...arguments);
		this.updateListeners();

		return result;
	},
	prependOnceListener() {
		const result = super.prependOnceListener(...arguments);
		this.updateListeners();

		return result;
	},
	removeListener() {
		const result = super.removeListener(...arguments);
		this.updateListeners();

		return result;
	},
	removeAllListeners() {
		const result = super.removeAllListeners(...arguments);
		this.updateListeners();

		return result;
	},
	// Record listeners for relaying from Device to Button(s)
	updateListeners() {
		// Assume empty and should remove from instances until a listener is found
		let isEmpty = true;
		const emitters = this.device.emitters;

		for (let i = 0; i < Object.keys(this.device.constructor.events).length; i++) {
			if (this.listeners.length > 0) {
				isEmpty = false;
			}
		}

		if (isEmpty && emitters.includes(this)) {
			_.pull(emitters, this);
		} else if (!isEmpty && !emitters.includes(this)) {
			emitters.push(this);
		}
	},
	// Determine if the emitter should emit
	willEmit() {
		for (const button of this) {
			if (button.willEmit(...arguments)) {
				return true;
			}
		}
		return false;
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


	// Each in Buttons methods
	const makeEachMethods = (key) => {
		const buttonsHaveFunction = buttons.every(buttons => (typeof buttons[key] === "function"));
		if (buttonsHaveFunction) {
			buttons[key + "Each"] = function() {
				const result = [];

				for (const button of this) {
					result.push(button[key](...arguments));
				}

				return result;
			};
		}
	};
	let buttonProto = buttons[0];
	while (buttonProto.constructor !== Button) {
		buttonProto = Object.getPrototypeOf(buttonProto);
	}
	// Methods added to the object and Button's prototype
	const eachMethods = Object.getOwnPropertyNames(buttons[0]).concat(Object.getOwnPropertyNames(buttonProto));
	for (const key of eachMethods) {
		makeEachMethods(key);
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
