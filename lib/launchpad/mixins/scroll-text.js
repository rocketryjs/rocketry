/*
	Module: Launchpad text scrolling mixin
	Description: Methods for scrollText capable Launchpad devices
*/
/*
	Module dependencies
*/
// lodash
const _ = require("lodash");
// Mixin
const {methods} = require("../../mixin.js");


module.exports = function() {
	// Methods, return object
	return methods(
		// Object to mixin to - from function.prototype.bind()
		this,

		// Instance
		{
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
		},

		// Static
		{
			normalizeText(text) {
				let result = [];
				if (Array.isArray(text)) {
					for (const object of text) {
						if (typeof object === "string") {
							// Recursive with each string
							result.push(this.normalizeText(object));
						} else if (typeof object === "number") {
							if (!_.inRange(object, 1, 8)) {
								throw new RangeError("Text speed isn't in the valid range.");
							}
							// Add plain speed byte, recursive with each string in object
							result.push(object);
						} else {
							throw new TypeError(`Text: ${object}, wasn't a number (for speed changes) or a string.`);
						}
					}
				} else {
					// Get character codes, not all ASCII works; not all non-standard ASCII fails so there's not currently a validation process
					for (let i = 0; i < text.length; i++) {
						result.push(text.charCodeAt(i));
					}
				}

				return result;
			}
		}
	);
};
