/*
	Module: Launchpad RGB button mixin
	Description: Methods for RGB color capable Launchpad devices' buttons
	TODO: add channels and note on messages
*/
/*
	Module dependencies
*/
const bindDeep = require("bind-deep");
const {properties} = require("../../../mixin.js");


const light = function(color) {
	// Normalize
	color = this.device.constructor.color.normalize(color);

	// Save
	this.light.current = color;

	// Send
	if (color.type === "rgb") {
		// RGB
		return this.device.send.sysex([this.device.constructor.sysex.prefix, 11, this.note, color.value]);
	} else if (color.type === "standard") {
		// Basic
		// this.device.sendSysEx([this.constructor.sysex.prefix, 10, this.note, color]); // TODO: remove
		const status = this.status.replace(/\s/g, "").toLowerCase();
		return this.device.send[status]([this.note, color.value], 1);
	}
};
light.stop = function() {
	return this.light("off");
};
light.reset = light.stop;

// Flashing
const flash = function(color) {
	// Normalize
	color = this.device.constructor.color.normalize(color);

	// Save
	this.flash.current = color;

	// Send
	if (color.type === "rgb") {
		// RGB
		throw new TypeError("Flashing can't be used with an RGB color via MIDI.");
	} else if (color.type === "standard") {
		// Basic
		// this.device.send.sysex([this.device.constructor.sysex.prefix, 35, 0, this.note, color.value]); // TODO: remove
		const status = this.status.replace(/\s/g, "").toLowerCase();
		return this.device.send[status]([this.note, color.value], 2);
	}

	// Method chaining
	return this;
};
flash.stop = function() {
	// Re-light or pulse color
	if (this.pulse.current) {
		this.pulse(this.pulse.current);
	} else if (this.light.current) {
		this.light(this.light.current);
	} else {
		// Stop flashing
		this.dark();
	}

	// Method chaining
	return this;
};
flash.reset = flash.stop;

// Pulsing
const pulse = function(color) {
	// Normalize
	color = this.device.constructor.color.normalize(color);

	// Save
	this.pulse.current = color;
	// Send
	if (color.type === "rgb") {
		// RGB
		throw new TypeError("Pulsing can't be used with an RGB color via MIDI.");
	} else if (color.type === "standard") {
		// Basic
		// this.device.send.sysex([this.device.constructor.sysex.prefix, 40, 0, this.note, color.value]); // TODO: remove
		const status = this.status.replace(/\s/g, "").toLowerCase();
		return this.device.send[status]([this.note, color.value], 3);
	}

	// Method chaining
	return this;
};
pulse.stop = function() {
	return this.pulse("off");
};
pulse.reset = pulse.stop;


module.exports = function() {
	// Properties
	properties(
		// Object to mix into
		this,

		// Instance
		{
			"light": {
				get() {
					return Object.defineProperty(this, "light", {
						"value": bindDeep(this, light)
					}).light;
				}
			},
			"dark": {
				get() {
					return this.light.stop;
				}
			},
			"flash": {
				get() {
					return Object.defineProperty(this, "flash", {
						"value": bindDeep(this, flash)
					}).flash;
				}
			},
			"pulse": {
				get() {
					return Object.defineProperty(this, "pulse", {
						"value": bindDeep(this, pulse)
					}).pulse;
				}
			}
		}
	);
};
