/*
	Module: Launchpad MK2
	Description: Class for the Launchpad MK2 device
*/
/*
	Module dependencies
*/
// lodash
const _ = require("lodash");


/*
	Code sharing
*/
// Launchpad - parent device class
const Launchpad = require("./launchpad-base.js");
// Methods shared with other RGB capable Launchpads
const rgbMethods = require("./methods/rgb.js");
const rgbStaticMethods = require("./methods/static-rgb.js");
const scrollTextMethods = require("./methods/scroll-text.js");
const scrollTextStaticMethods = require("./methods/static-scroll-text.js");
const midiClockMethods = require("./methods/midi-clock.js");


class Mk2 extends Launchpad {
	constructor() {
		// Launchpad, Device, EventEmitter
		super(...arguments);

		// Method chaining with shared methods
		return Object.assign(
			// Instance
			this,
			// Instance methods
			rgbMethods,
			scrollTextMethods,
			midiClockMethods
		);
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


	static get sysex() {
		return {
			"prefix": [240, 0, 32, 41, 2, 24],
			"suffix": 247
		};
	}
	static get name() {
		return "Launchpad MK2";
	}
	static get regex() {
		return `^(?:[\\d-]*\\s+)?(${this.name})`;
	}
	static is(object) {
		return object instanceof this;
	}
}


// Export class with shared static methods
module.exports = Object.assign(
	// Class
	Mk2,
	// Static methods
	rgbStaticMethods,
	scrollTextStaticMethods
);
