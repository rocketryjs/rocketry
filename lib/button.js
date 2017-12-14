/*
	Module dependencies
*/
// Node Events
const EventEmitter = require("events");
// lodash
const _ = require("lodash");
// Core
const core = require("./core.js");


class Button extends EventEmitter {
	constructor(value) {
		// EventEmitter
		super();

		this.value = value;

		// Method chaining
		return this;
	}

	// Interaction
	// Color
	setColor(color) {
		color = this.constructor.launchpad._normalizeColor(color);

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
			core.send(mode, {"header": value.header, "led": value.note, color}, this.constructor.launchpad);
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
		color = this.constructor.launchpad._normalizeColor(color);

		if (Array.isArray(color)) {
			// RGB
			throw new TypeError("Flashing can't be used with an RGB color via MIDI.");
		} else if (typeof color === "number") {
			// Basic
			for (const value of this.values) {
				core.send("flash", {"led": value.note, color}, this.constructor.launchpad);
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
		color = this.constructor.launchpad._normalizeColor(color);

		if (Array.isArray(color)) {
			// RGB
			throw new TypeError("Pulsing can't be used with an RGB color via MIDI.");
		} else if (typeof color === "number") {
			// Basic
			for (const value of this.values) {
				core.send("pulse", {"led": value.note, color}, this.constructor.launchpad);
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
		this.updateListeners();

		// Method chaining
		return this;
	}
	on() {
		super.on(...arguments);
		this.updateListeners();

		// Method chaining
		return this;
	}
	once() {
		super.once(...arguments);
		this.updateListeners();

		// Method chaining
		return this;
	}
	prependListener() {
		super.prependListener(...arguments);
		this.updateListeners();

		// Method chaining
		return this;
	}
	prependOnceListener() {
		super.prependOnceListener(...arguments);
		this.updateListeners();

		// Method chaining
		return this;
	}
	removeListener() {
		super.removeListener(...arguments);
		this.updateListeners();

		// Method chaining
		return this;
	}
	removeAllListeners() {
		super.removeAllListeners(...arguments);
		this.updateListeners();

		// Method chaining
		return this;
	}
	// Record listeners for relaying from Launchpad to Button
	updateListeners() {
		// Assume empty and should remove from instances until a listener is found
		let isEmpty = true;
		const emitters = this.constructor.launchpad.emitters;

		for (let i = 0; i < Object.keys(this.constructor.launchpad.events).length; i++) {
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
