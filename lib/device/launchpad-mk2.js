/*
	Module dependencies
*/
// lodash
const _ = require("lodash");
// Core
const Launchpad = require("./launchpad.js");


class Mk2 extends Launchpad {
	constructor() {
		// Launchpad, Device, EventEmitter
		super(...arguments);
	}


	// Text Scrolling
	scrollText(color, text, loop = 0) {
		color = this.normalizeColor(color);
		if (text) {
			text = this.normalizeText(text);
		} else {
			text = 0;
		}
		loop = +loop; // true, 1 => 1; false, 0, "" => 0

		if (Array.isArray(color)) {
			// RGB
			throw new TypeError("Text scrolling can't be used with an RGB color via MIDI.");
		} else if (typeof color === "number") {
			// Basic
			// core.send("scroll text", {color, loop, text}, this); TODO
		}

		// Method chaining
		return this;
	}

	// Scroll stopping
	stopScrollText() {
		return this.scrollText(0);
	}


	// Normalization of arguments for MIDI
	// Passes along x and y values, normalizes formats of note and header values
	normalizeButtonValues(object) {
		if (object.x && object.y) {
			// keys => x, y
			return this.normalizeButtonCoords(object.x, object.y);
		} else if (Array.isArray(object)) {
			// [x, y]
			return this.normalizeButtonCoords(object[0], object[1]);
		} else if (typeof object.note === "number") {
			// keys => header?, value
			const header = object.header || this.buttonConfig.pad.header;
			return {
				header,
				"note": object.note
			};
		} else if (object === "pad") {
			// whole pad
			const xRange = _.range(...this.buttonConfig.pad.range.x);
			const yRange = _.range(...this.buttonConfig.pad.range.y);
			for (const x of xRange) {
				for (const y of yRange) {
					this.normalizeButtonCoords(x, y);
				}
			}
		} else if (typeof object === "string" && (object = _.at(this.buttonConfig, object)[0])) {
			// from config
			if (!object.note && !object.x) {
				// object of buttons
				for (const key in object) {
					this.normalizeButtonValues(object[key]);
				}
			} else {
				// single button
				this.normalizeButtonValues(object);
			}
		} else {
			throw new TypeError("Invalid button location.");
		}
	}

	// Validates x and y values, normalizes formats
	normalizeButtonCoords(x, y) {
		// Validate
		// Not number or not in range of the device's pad
		if (!_.inRange(x, ...this._buttons.pad.range.x) || !_.inRange(y, ...this._buttons.pad.range.y)) {
			throw new RangeError("One or more coordinates either isn't a number or in the pad range for your device.");
		}

		// Set values
		this.values.push({
			"header": this._buttons.pad.header,
			"note": parseInt(`${y + this._buttons.pad.offset.y}${x + this._buttons.pad.offset.x}`)
		});
	}

	// Validates colors, finds colors from their names, and normalizes formats from many into a single one for each RGB and standard colors for internal use.
	normalizeColor(color) {
		const config = this.getConfig("colors");
		// Validate and normalize colors for use in commands
		let result;
		let valid;

		// Named basic or RGB color
		if (typeof color === "string") {
			// From user's color names first, then fallback on default
			result = (typeof this.colors !== "undefined" && this.colors[color]) || config.names[color];
			return this.normalizeColor(result);
		}

		// Values
		if (typeof color === "object") {
			// RGB: {red, green, blue} or {r, g, b} or [red, green, blue]
			result = [];
			result[0] = color.red || color.r || color[0];
			result[1] = color.green || color.g || color[1];
			result[2] = color.blue || color.b || color[2];

			const range = config.rgb.range;
			valid = result.every(value => {
				return _.inRange(value, ...range);
			}, this);
		} else {
			// Basic: user color name or defaults color name for the device or use number
			result = color;

			const range = config.basic.range;
			valid = _.inRange(result, ...range);
		}

		// Exit
		if (!valid) {
			throw new RangeError("One or more of your color values aren't in the accepted range.");
		}
		return result;
	}

	normalizeText(text) {
		let result = [];
		if (Array.isArray(text)) {
			for (const object of text) {
				if (typeof object === "string") {
					// Recursive with each string
					result.push(this.normalizeText(object));
				} else {
					// Add plain speed byte, recursive with each string in object
					result.push(object.speed);
					result.push(this.normalizeText(object.text));
				}
			}
		} else {
			// Get character codes, not all ASCII works; not all non-standard ASCII fails so there's not currently a validation process
			for (let i = 0; i < text.length; i++) {
				result.push(text.charCodeAt(i));
			}
		}
		return result;
	}

	static is(object) {
		return object instanceof this;
	}
	static get name() {
		return "Launchpad MK2";
	}
	static get regex() {
		return `^(?:[\\d-]*\\s+)?(${this.name})`;
	}
}

module.exports = Mk2;
