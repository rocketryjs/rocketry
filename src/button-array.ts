/*
	Module: Button array
	Description: The button array constructor that makes an array with instance methods
*/

import {SubEmitter} from "./sub-emitter";


/*
	ButtonArray
*/
export const ButtonArray = function(parent, ...values) {
	// Run constructor
	const buttons = [];
	for (const value of values) {
		buttons.push(...parent.get(value));
	}
	// Return empty array if it didn't match anything
	// TODO: doesn't have prototype? Why did I do this?
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

	// Return array with prototyping
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
		const willEmitSome = this.each.willEmit(...arguments).some(value => (value));
		if (willEmitSome) {
			return true;
		} else {
			return false;
		}
	},

	// Proxy for each.method and each.property
	get each() {
		return Object.defineProperty(this, "each", {
			"value": new Proxy(this, {
				get(target, property) {
					return function() {
						const result = [];

						for (const button of target.buttons) {
							if (typeof button[property] === "function") {
								result.push(button[property](...arguments));
							} else {
								result.push(button[property]);
							}
						}

						return result;
					};
				}
			})
		}).each;
	},


	// Get buttons for generator
	get buttons() {
		return [...this];
	},


	// Iterator for use in for loops and spread syntax
	* [Symbol.iterator]() {
		// Get all keys
		for (let i = 0; i < this.length; i++) {
			yield this[i];
		}
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
// TODO: HIGH PRIORITY: Fix button array by using a better design pattern, not depending on device code and hacky prototyping, add back querying
// mixin(ButtonArray, "./launchpad/mixins/query.js");
