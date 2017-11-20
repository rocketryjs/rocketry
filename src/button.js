/*
	Module dependencies
*/
// Node Events
const EventEmitter = require("events");
// lodash
const _ = require("lodash");
// Core
const _core = require("./core.js");
// Launchpad class
const Launchpad = require("./launchpad.js");


class Button extends EventEmitter {
	constructor(...args) {
		// EventEmitter
		super();

		// The Launchpad instance it belongs to is either passed through as an argument or the last Launchpad created (for glorious laziness when using only one Launchpad).
		const lastArg = _.last(args);
		if (Launchpad.isLaunchpad(lastArg)) {
			this.launchpad = lastArg;
			args.pop();
		} else {
			this.launchpad = Launchpad.lastInstance;
		}

		// Config
		this._buttons = this.launchpad.getConfig("buttons");

		// Set values
		this.values = [];
		// Arrays of coordinate pairs, object of MIDI values or coordinate pairs
		for (const object of args) {
			this._getValues(object);
		}

		// Method chaining
		return this;
	}

	// Get button values
	_getValues(object) {
		if (object.x && object.y) {
			// keys => x, y
			this._xy(object.x, object.y);
		} else if (Array.isArray(object)) {
			// [x, y]
			this._xy(object[0], object[1]);
		} else if (typeof object.note === "number") {
			// keys => header?, value
			const header = object.header || this._buttons.pad.header;
			this.values.push({
				header,
				"note": object.note
			});
		} else if (Array.isArray(object.note)) {
			// keys => header?, note
			// Iterate through notes
			for (let i = 0; i < object.note.length; i++) {
				const header = object.headers[i] || object.header || this._buttons.pad.header;
				this.values.push({
					header,
					"note": object.note[i]
				});
			}
		} else if (object === "pad") {
			// whole pad
			const xRange = _.range(...this._buttons.pad.x);
			const yRange = _.range(...this._buttons.pad.y);
			for (const x of xRange) {
				for (const y of yRange) {
					this._getValues([x, y]);
				}
			}
		} else if (typeof object === "string" && (object = _.at(this._buttons, object)[0])) {
			// from config
			if (!object.note && !object.x) {
				// object of buttons
				for (const key in object) {
					this._getValues(object[key]);
				}
			} else {
				// single button
				this._getValues(object);
			}
		} else {
			throw new TypeError("Invalid button location.");
		}
	}
	// Values from coordinates
	_xy(x, y) {
		// Validate
		// Not number or not in range of the device's pad
		if (!_.inRange(x, ...this._buttons.pad.x) || !_.inRange(y, ...this._buttons.pad.y)) {
			throw new RangeError("One or more coordinates either isn't a number or in the pad range for your device.");
		}

		// Set values
		this.values.push({
			"header": this._buttons.pad.header,
			"note": parseInt(`${y + this._buttons.pad.offset.y}${x + this._buttons.pad.offset.x}`)
		});
	}

	// Interaction
	// Color
	setColor(color) {
		color = this.launchpad.normalizeColor(color);

		let mode;
		if (typeof color === "object") {
			// RGB
			mode = "light rgb";
		} else if (typeof color === "number") {
			// Basic
			mode = "light";
		}

		for (const value of this.values) {
			// Send to core, extra arguments are ignored so no need to remove the header for RGB mode
			_core.send(mode, {"header": value.header, "led": value.note, color}, this.launchpad);
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
	dark() {
		return this.setColor("off");
	}
	// Flashing
	flash(color) {
		color = this.launchpad.normalizeColor(color);

		if (Array.isArray(color)) {
			// RGB
			throw new TypeError("Flashing can't be used with an RGB color via MIDI.");
		} else if (typeof color === "number") {
			// Basic
			for (const value of this.values) {
				_core.send("flash", {"led": value.note, color}, this.launchpad);
			}
		}

		// Method chaining
		return this;
	}
	stopFlash() {
		return this.flash("off");
	}
	// Pulsing
	pulse(color) {
		color = this.launchpad.normalizeColor(color);

		if (Array.isArray(color)) {
			// RGB
			throw new TypeError("Pulsing can't be used with an RGB color via MIDI.");
		} else if (typeof color === "number") {
			// Basic
			for (const value of this.values) {
				_core.send("pulse", {"led": value.note, color}, this.launchpad);
			}
		}

		// Method chaining
		return this;
	}
	stopPulse() {
		return this.pulse("off");
	}

	// Extend EventEmitter methods
	addListener() {
		super.addListener(...arguments);
		this._updateListeners();

		// Method chaining
		return this;
	}
	on() {
		super.on(...arguments);
		this._updateListeners();

		// Method chaining
		return this;
	}
	once() {
		super.once(...arguments);
		this._updateListeners();

		// Method chaining
		return this;
	}
	prependListener() {
		super.prependListener(...arguments);
		this._updateListeners();

		// Method chaining
		return this;
	}
	prependOnceListener() {
		super.prependOnceListener(...arguments);
		this._updateListeners();

		// Method chaining
		return this;
	}
	removeListener() {
		super.removeListener(...arguments);
		this._updateListeners();

		// Method chaining
		return this;
	}
	removeAllListeners() {
		super.removeAllListeners(...arguments);
		this._updateListeners();

		// Method chaining
		return this;
	}
	// Record listeners for _core
	_updateListeners() {
		// Assume empty and should remove from instances until a listener is found
		let isEmpty = true;
		const emitters = this.launchpad.emitters;

		for (let i = 0; i < this.launchpad.events.length; i++) {
			if (this.listeners.length > 0) {
				isEmpty = false;
			}
		}

		if (isEmpty && emitters.includes(this)) {
			_.pull(emitters, this);
		} else if (!isEmpty && !emitters.includes(this)) {
			emitters.push(this);
		}
	}

	static isButton(object) {
		return object instanceof this;
	}
}


module.exports = Button;
