/*
	Module: Button array
	Description: The button array constructor that makes an array with instance methods
*/
/*
	Module dependencies
*/
// SubEmitter
const SubEmitter = require("./sub-emitter.js");
// Button
const Button = require("./button.js");
// Mixin
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


	// Each in Buttons methods
	// TODO: proxy
	const makeEachMethods = (key) => {
		// Skip constructor
		if (key === "constructor") {
			return;
		}

		// Make for all methods
		const buttonsHaveFunction = buttons.every(buttons => (typeof buttons[key] === "function"));
		if (buttonsHaveFunction) {
			Object.defineProperty(
				buttons,
				key + "Each",
				{
					value() {
						const result = [];

						for (const button of this) {
							result.push(button[key](...arguments));
						}

						return result;
					}
				}

			);
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
		ButtonArray.prototype
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
