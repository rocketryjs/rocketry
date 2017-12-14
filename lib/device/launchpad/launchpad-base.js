/*
	Module dependencies
*/
// lodash
// const _ = require("lodash"); TODO
// Device class
const Device = require("../device-base.js");

/*
	Functions
*/
// TODO
// const hasSimilarBytes = function(message, template) {
// 	for (let i = 0; i < template.length; i++) {
// 		if (typeof template[i] === "string") {
// 			continue;
// 		}
//
// 		if (message[i] === template[i]) {
// 			continue;
// 		} else {
// 			return false;
// 		}
// 	}
//
// 	return true;
// };

/*
	Launchpad Class
*/
class Launchpad extends Device {
	constructor() {
		// Device, EventEmitter
		super(...arguments);

		// Method chaining
		return this;
	}


	// // Get buttons TODO
	// getButton(...values) {
	// 	// TODO: move, fix, meta program in original methods
	// 	const buttonsProto = {
	// 		"test": function() {
	// 			console.log("yuay");
	// 		}
	// 	};
	// 	// Set values
	// 	const buttons = [];
	// 	// Arrays of coordinate pairs, object of MIDI values or coordinate pairs
	// 	for (const value of values) {
	// 		buttons.push(
	// 			new this.Button(
	// 				this._normalizeButtonValues(value)
	// 			)
	// 		);
	// 	}
	//
	// 	// Return array of `Button`s with the interaction methods
	// 	// Flatten out the arrays TODO?
	// 	return _.flattenDeep(
	// 		// Return and mutate the `buttons` array
	// 		Object.assign(
	// 			buttons,
	// 			// Add the methods from `buttonsProto`
	// 			buttonsProto
	// 		)
	// 	);
	// }
	// // Aliases for getButton
	// getButtons() {
	// 	return this.getButton(...arguments);
	// }
	// // Get column
	// getColumn(value) {
	//
	// }
	// // Get row
	// getRow(value) {
	//
	// }
	// // Get pad
	// getPadButtons() {
	// 	return this.getButton("pad");
	// }
	// getPad() {
	// 	return this.getPadButtons();
	// }
	// // Get all buttons
	// getAllButtons() {
	// 	return this.getButton("all");
	// }
	// getAll() {
	// 	return this.getAllButtons();
	// }


	// Interaction
	// Color
	setColor(color) {
		color = this.normalizeColor(color);

		if (Array.isArray(color)) {
			// RGB
			throw new TypeError("Light all can't be used with an RGB color via MIDI.");
		} else if (typeof color === "number") {
			// Basic
			this.sendSysEx([14, color]);
		}

		// Method chaining
		return this;
	}
	// Aliases for setColor
	set color(color) {
		this.setColor(color);
	}
	light(color) {
		return this.setColor(color);
	}
	lightAll(color) {
		return this.setColor(color);
	}
	dark() {
		return this.setColor("off");
	}
	darkAll() {
		return this.setColor("off");
	}


	static is(object) {
		return object instanceof this;
	}
}


module.exports = Launchpad;
