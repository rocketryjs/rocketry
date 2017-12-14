/*
	Module: Launchpad RGB methods
	Description: Methods for RGB color capable Launchpad devices
*/


module.exports = {
	// Color
	setColor(color) {
		color = this.constructor.normalizeColor(color);

		if (Array.isArray(color)) {
			// RGB
			throw new TypeError("Light all can't be used with an RGB color via MIDI.");
		} else if (typeof color === "number") {
			// Basic
			this.sendSysEx([14, color]);
		}

		// Method chaining
		return this;
	},
	// Aliases for setColor
	set color(color) {
		this.setColor(color);
	},
	light(color) {
		return this.setColor(color);
	},
	lightAll(color) {
		return this.setColor(color);
	},
	dark() {
		return this.setColor("off");
	},
	darkAll() {
		return this.setColor("off");
	},


	// Full reset - (TODO: layout, etc)
	reset() {
		this.dark();

		// Method chaining
		return this;
	}
};
