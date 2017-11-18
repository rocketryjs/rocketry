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

		// Pad config
		this._pad = this.launchpad.getConfig("buttons.pad");

		// Set values
		this.values = [];
		// Arrays of coordinate pairs, object of MIDI values or coordinate pairs
		for (const object of args) {
			if (object.x && object.y) {
				// keys => x, y
				this._xy(object.x, object.y);
			} else if (Array.isArray(object)) {
				// [x, y]
				this._xy(object[0], object[1]);
			} else if (object.value) {
				// keys => header?, value
				const header = object.header || this._pad._header;
				this.values.push({
					header,
					"note": object.value
				});
			} else if (object.values) {
				// keys => header?, values
				// Iterate through Values
				for (let i = 0; i < object.values.length; i++) {
					const header = object.headers[i] || object.header || this._pad._header;
					this.values.push({
						header,
						"note": object.values[i]
					});
				}
			} else {
				throw new TypeError("Invalid Button location.");
			}
		}

		if (!this.listeners) {
			this.listeners = {};
			for (const event of this.launchpad.events) {
				this.listeners[event] = [];
			}
		}

		// Method chaining
		return this;
	}

	// Values from coordinates
	_xy(x, y) {
		// Validate
		// Not number or not in range of the device's pad
		if (!_.inRange(x, ...this._pad.x) || !_.inRange(y, ...this._pad.y)) {
			throw new RangeError("One or more coordinates either isn't a number or in the pad range for your device.");
		}

		// Set values
		this.values.push({
			"header": this._pad._header,
			"note": parseInt(`${y + this._pad.offset.y}${x + this._pad.offset.x}`)
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
	addListener(eventName, listener) {
		this._pushListener(eventName, listener);
		return super.addListener(...arguments);
	}
	on(eventName, listener) {
		this._pushListener(eventName, listener);
		return super.on(...arguments);
	}
	once(eventName, listener) {
		this._pushListener(eventName, listener);
		return super.once(...arguments);
	}
	prependListener(eventName, listener) {
		this._pushListener(eventName, listener);
		return super.prependListener(...arguments);
	}
	prependOnceListener(eventName, listener) {
		this._pushListener(eventName, listener);
		return super.prependOnceListener(...arguments);
	}
	removeListener(eventName, listener) {
		this._pullListener(eventName, listener);
		return super.removeListener(...arguments);
	}
	removeAllListeners(eventName) {
		this._removeListeners(eventName);
		return super.removeAllListeners(...arguments);
	}
	// Record listeners for _core
	_pushListener(eventName, listener) {
		if (this.launchpad.events.includes(eventName)) {
			// TODO: add Button instance if not already in array
			this.listeners[eventName].push(listener);
		} else {
			throw new Error("eventName isn't a valid event.");
		}
	}
	_pullListener(eventName, listener) {
		if (this.launchpad.events.includes(eventName)) {
			// TODO: remove Button instance if all listeners are empty, soft - no error
			_.pull(this.listeners[eventName], listener);
		} else {
			throw new Error("eventName isn't a valid event.");
		}
	}
	_removeListeners(eventName) {
		if (this.launchpad.events.includes(eventName)) {
			// TODO: remove Button instance if all listeners are empty, soft - no error
			this.listeners[eventName] = [];
		} else {
			throw new Error("eventName isn't a valid event.");
		}
	}

	static isButton(object) {
		return object instanceof this;
	}
}


module.exports = Button;
