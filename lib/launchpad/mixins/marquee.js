/*
	Module: Launchpad marquee mixin
	Description: Methods and event for marquee capable Launchpad devices
*/
/*
	Module dependencies
*/
const _ = require("lodash");
const {methods, events} = require("../../mixin.js");


module.exports = function() {
	// Methods
	methods(
		// Object to mixin to - from function.prototype.bind()
		this,

		// Instance
		{
			// Text Scrolling across the pad
			marquee(text, color = "white", loop = 0) {
				color = this.constructor.normalizeColor(color);
				if (text) {
					text = this.constructor.normalizeText(text);
				} else {
					text = [0];
				}
				loop = +loop; // true, 1 => 1; false, 0, "" => 0

				if (Array.isArray(color)) {
					// RGB
					throw new TypeError("Marquee can't be used with an RGB color via MIDI.");
				} else if (typeof color === "number") {
					// Basic
					this.sendSysEx([20, color, loop, text]);
				}

				// Return promise to detect loop or stop (stopMarquee or finished)
				// This will only resolve once but looping may cause the event to fire after a single "marquee" event
				// 0 => never timeout - since the text may be long
				return this.promiseOnce("marquee", 0);
			},
			// Stop the marquee
			stopMarquee() {
				return this.marquee();
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


	// Events
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

	events(this, {
		// When marquee stops or loops
		"marquee": {
			"status": sysExStatus,
			"manufacturer id": manufacturerId,
			"model id": modelId,
			"method response": {
				"matches": [21]
			},
			"footer": sysExFooter
		}
	});
};
