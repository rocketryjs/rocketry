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
// Button Query
const query = require("./query.js");


/*
	Hoisting
*/
// Prototype to ButtonArray, I just wanted the class towards the top
let prototype;


/*
	ButtonArray
*/
const ButtonArray = function(parent, ...values) {
	// Constructor
	const buttons = [];
	for (const value of values) {
		buttons.push(...parent.get(value));
	}
	// Return empty array if it didn't match anything
	if (buttons.length === 0) {
		return buttons;
	}
	// Add device it belongs to from the parent's or the parent itself
	buttons.device = parent.device || parent;


	// Each in Buttons methods
	// TODO: better
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


/*
	Prototype

	Methods for the ButtonArray, query selectors are added after
*/
prototype = {
	// Generator for matches
	* get(value) {
		for (const button of this) {
			if (button.test(value)) {
				yield button;
			}
		}
	},

	/*
		Query selectors from module - smart getter
	*/
	get query() {
		return Object.defineProperty(this, "query", {
			value: query(this),
			writable: false
		}).query;
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
	// TODO: use willEmitEach?
	willEmit() {
		for (const button of this) {
			if (button.willEmit(...arguments)) {
				return true;
			}
		}
		return false;
	},


	// Iterator for use in for loops and spread syntax
	// TODO make innumerable?
	* [Symbol.iterator]() {
		// Get all keys
		for (const key in this) {
			// Only yield keys that are digits in the key string
			if (/^\d+$/i.test(key)) {
				yield this[key];
			}
		}
	},


	// this.toString => [object ButtonArray]
	get [Symbol.toStringTag]() {
		return "ButtonArray";
	}
};


/*
	Export class
*/
module.exports = ButtonArray;
