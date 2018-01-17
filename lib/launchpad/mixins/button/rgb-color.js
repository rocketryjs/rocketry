/*
	Module: Launchpad RGB button mixin
	Description: Methods for RGB color capable Launchpad devices' buttons
	TODO: add channels and note on messages
*/
/*
	Module dependencies
*/
const {methods, properties} = require("../../../mixin.js");


module.exports = function() {
	// Methods
	methods(
		// Object to mix into
		this,

		// Instance
		{
			// Color
			light(color) {
				// Normalize
				color = this.device.constructor.normalizeColor(color);

				// Save
				this["color"] = color;

				// Send
				if (Array.isArray(color)) {
					// RGB
					this.device.sendSysEx([11, this.note, ...color]);
				} else if (typeof color === "number") {
					// Basic
					this.device.sendSysEx([10, this.note, color]);
				}

				// Method chaining
				return this;
			},
			dark() {
				return this.light("off");
			},
			// Flashing
			flash(color) {
				// Normalize
				color = this.device.constructor.normalizeColor(color);

				// Save
				this["flash color"] = color;

				// Send
				if (Array.isArray(color)) {
					// RGB
					throw new TypeError("Flashing can't be used with an RGB color via MIDI.");
				} else if (typeof color === "number") {
					// Basic
					this.device.sendSysEx([35, 0, this.note, color]);
				}

				// Method chaining
				return this;
			},
			stopFlash() {
				// Re-light or pulse color
				if (this["pulse color"]) {
					this.pulse(this["pulse color"]);
				} else if (this["color"]) {
					this.light(this["color"]);
				} else {
					// Stop flashing
					this.dark();
				}

				// Method chaining
				return this;
			},
			// Pulsing
			pulse(color) {
				// Normalize
				color = this.device.constructor.normalizeColor(color);

				// Save
				this["pulse color"] = color;
				// Send
				if (Array.isArray(color)) {
					// RGB
					throw new TypeError("Pulsing can't be used with an RGB color via MIDI.");
				} else if (typeof color === "number") {
					// Basic
					this.device.sendSysEx([40, 0, this.note, color]);
				}

				// Method chaining
				return this;
			},
			stopPulse() {
				return this.pulse("off");
			}
		}
	);


	// Properties, return object
	return properties(
		// Object to mix into
		this,

		// Instance
		{
			"color": {
				set(color) {
					this._color = color;
					this._flash = 0;
					this._pulse = 0;
				},
				get() {
					return this._color || 0;
				}
			},
			"flash color": {
				set(color) {
					this._flash = color;
				},
				get() {
					return this._flash || 0;
				}
			},
			"pulse color": {
				set(color) {
					this._color = 0;
					this._flash = 0;
					this._pulse = color;
				},
				get() {
					return this._pulse || 0;
				}
			}
		}
	);
};
