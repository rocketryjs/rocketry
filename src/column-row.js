/*
	Module dependencies
*/
// Core
const _core = require("./core.js");
// Launchpad class
const Launchpad = require("./launchpad.js");


const RowColumn = class {
	constructor(value, launchpad) {
		if (Launchpad.isLaunchpad(launchpad)) {
			this.launchpad = launchpad;
		} else {
			this.launchpad = Launchpad.launchpad;
		}

		this.value = value;
	}

	setColor(color) {
		color = this.launchpad.normalizeColor(color);
		this.constructor._setColor(this.value, color, this.launchpad);

		// Method chaining
		return this;
	}
	set color(color) {
		// Alias for setColor since both can be useful
		this.setColor(color);
	}
};


let classes = [];
(function(classNames) {
	for (const className of classNames) {
		const classNameLower = className.toLowerCase();

		classes[className] = class extends RowColumn {
			constructor(value, launchpad) {
				super(value, launchpad);

				// Method chaining
				return this;
			}

			static _setColor(value, color, launchpad) {
				if (Array.isArray(color)) {
					// RGB
					throw new TypeError("Columns and rows can't be set to RGB colors all at once via MIDI.");
				} else if (typeof color === "number") {
					// Basic
					_core.send(`light ${classNameLower}`, {[classNameLower]: value, color}, launchpad);
				}
			}
			static [`is${className}`](object) {
				return object instanceof this;
			}
		};
	}
})(["Column", "Row"]);


module.exports = classes;
