/*
	Module: Launchpad text scrolling methods
	Description: Methods for scrollText capable Launchpad devices
*/


module.exports = {
	// Text Scrolling
	scrollText(color, text, loop = 0) {
		color = this.constructor.normalizeColor(color);
		if (text) {
			text = this.constructor.normalizeText(text);
		} else {
			text = [0];
		}
		loop = +loop; // true, 1 => 1; false, 0, "" => 0

		if (Array.isArray(color)) {
			// RGB
			throw new TypeError("Text scrolling can't be used with an RGB color via MIDI.");
		} else if (typeof color === "number") {
			// Basic
			this.sendSysEx([20, color, loop, ...text]);
		}

		// Method chaining
		return this;
	},
	// Scroll text stopping
	stopScrollText() {
		return this.scrollText("off");
	}
};
