/*
	Module: Launchpad text scrolling mixin
	Description: Methods and event for scrollText capable Launchpad devices
*/
/*
	Module dependencies
*/
// lodash
const _ = require("lodash");
// Mixin
const {methods} = require("../../mixin.js");


module.exports = function() {
	// Events
	// Add destination
	if (typeof this.events !== "object") {
		this.events = {};
	}

	// Shared bytes
	const sysExStatus = {
		"matches": [240],
		mutate(message) {
			message.status = message.status[0];
		}
	};
	const sysExFooter = {
		"matches": [247],
		mutate(message) {
			message.footer = message.footer[0];
		}
	};
	const manufacturerId = {
		"matches": this.sysExManufacturerId
	};
	const modelId = {
		"matches": this.sysExModelId
	};

	Object.assign(this.events, {
		// When text scrolling stops or loops
		"text scrolled": {
			"status": sysExStatus,
			"manufacturer id": manufacturerId,
			"model id": modelId,
			"method response": {
				"matches": [21]
			},
			"footer": sysExFooter
		}
	});

	// Methods, return object
	return methods(
		// Object to mixin to - from function.prototype.bind()
		this,

		// Instance
		{
			// Text Scrolling
			scrollText(text, color = "white", loop = 0) {
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

				// Return promise to detect loop or scroll stop (stopScrollText or finished)
				// This will only resolve once but looping may cause the event to fire after a single "text scrolled"
				// 0 => never timeout - since the text may be long
				return this.promiseOnce("text scrolled", 0);
			},
			// Scroll text stopping
			stopScrollText() {
				return this.scrollText();
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
