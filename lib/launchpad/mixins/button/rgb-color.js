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
				this.color.light = color;

				// Send
				if (Array.isArray(color)) {
					// RGB
					this.device.sendSysEx([this.constructor.sysex.prefix, 11, this.note, color]);
				} else if (typeof color === "number") {
					// Basic
					this.device.sendSysEx([this.constructor.sysex.prefix, 10, this.note, color]);
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
				this.color.flash = color;

				// Send
				if (Array.isArray(color)) {
					// RGB
					throw new TypeError("Flashing can't be used with an RGB color via MIDI.");
				} else if (typeof color === "number") {
					// Basic
					this.device.sendSysEx([this.constructor.sysex.prefix, 35, 0, this.note, color]);
				}

				// Method chaining
				return this;
			},
			stopFlash() {
				// Re-light or pulse color
				if (this.color.pulse) {
					this.pulse(this.color.pulse);
				} else if (this.color.light) {
					this.light(this.color.light);
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
				this.color.pulse = color;
				// Send
				if (Array.isArray(color)) {
					// RGB
					throw new TypeError("Pulsing can't be used with an RGB color via MIDI.");
				} else if (typeof color === "number") {
					// Basic
					this.device.sendSysEx([this.constructor.sysex.prefix, 40, 0, this.note, color]);
				}

				// Method chaining
				return this;
			},
			stopPulse() {
				return this.pulse("off");
			}
		}
	);


	// Properties
	properties(
		// Object to mix into
		this,

		// Instance
		{
			"color": {
				"light": {
					set(color) {
						this._light = color;
						this._flash = 0;
						this._pulse = 0;
					},
					get() {
						return this._light || 0;
					}
				},
				"flash": {
					set(color) {
						this._flash = color;
					},
					get() {
						return this._flash || 0;
					}
				},
				"pulse": {
					set(color) {
						this._light = 0;
						this._flash = 0;
						this._pulse = color;
					},
					get() {
						return this._pulse || 0;
					}
				}
			}
		}
	);
};
