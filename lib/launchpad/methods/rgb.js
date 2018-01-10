/*
	Module: Launchpad RGB methods
	Description: Methods for RGB color capable Launchpad devices
*/


module.exports = {
	// Color
	light(color) {
		// Normalize
		color = this.constructor.normalizeColor(color);

		// Save
		for (const button of this.buttons) {
			button.color = color;
		}

		// Send
		if (Array.isArray(color)) {
			// RGB
			for (const button of this.buttons) {
				button.light(color);
			}
		} else if (typeof color === "number") {
			// Basic
			this.sendSysEx([14, color]);
		}

		// Method chaining
		return this;
	},
	dark() {
		return this.light("off");
	},
	flash(color) {
		for (const button of this.buttons) {
			button.flash(color);
		}

		// Method chaining
		return this;
	},
	stopFlash() {
		for (const button of this.buttons) {
			button.stopFlash();
		}

		// Method chaining
		return this;
	},
	pulse(color) {
		for (const button of this.buttons) {
			button.pulse(color);
		}

		// Method chaining
		return this;
	},
	stopPulse() {
		for (const button of this.buttons) {
			button.stopPulse();
		}

		// Method chaining
		return this;
	}
};
