/*
	Module: Button array
	Description: The button array constructor that makes an array with instance methods
*/
/*
	Module dependencies
*/
const SubEmitter = require("./sub-emitter.js");
const mixin = require("../mixin.js");


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
	Object.defineProperty(
		buttons,
		"device",
		{
			"value": parent.device || parent
		}
	);


	// [light|note|whatever]Each methods
	const proxyHandler = {
		get(target, property) {
			let match;
			if (typeof property === "string") {
				match = property.match(/(.+)Each$/);
			}
			if (match) {
				const property = match[1];
				return function() {
					const result = [];

					for (const button of this.buttons) {
						if (typeof button[property] === "function") {
							result.push(button[property](...arguments));
						} else {
							result.push(button[property]);
						}
					}

					return result;
				};
			} else {
				return Reflect.get(...arguments);
			}
		}
	};


	// Prototyping, proxy for each methods
	return new Proxy(
		Object.setPrototypeOf(
			// this => array of `Button`s
			buttons,
			// Prototype
			ButtonArray.prototype
		),
		proxyHandler
	);
};


/*
	Prototype

	Methods for the ButtonArray
*/
ButtonArray.prototype = {
	// Determine if the emitter should emit
	willEmit() {
		const willEmitSome = this.willEmitEach && this.willEmitEach(...arguments).some(value => (value));
		if (willEmitSome) {
			return true;
		} else {
			return false;
		}
	},


	// Get buttons for generator
	get buttons() {
		return [...this];
	},


	// Symbols
	// Iterator for use in for loops and spread syntax
	* [Symbol.iterator]() {
		// Get all keys
		for (let i = 0; i < this.length; i++) {
			yield this[i];
		}
	},
	// this.toString => [object ButtonArray]
	get [Symbol.toStringTag]() {
		return "ButtonArray";
	}
};
Object.setPrototypeOf(
	// Methods
	ButtonArray.prototype,
	// SubEmitter > EventEmitter extension
	SubEmitter.prototype
);


/*
	Mixins
*/
mixin(ButtonArray, "./launchpad/mixins/query.js");


/*
	Export class
*/
module.exports = ButtonArray;
