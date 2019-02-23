/*
	Module: Launchpad marquee mixin
	Description: Methods and event for marquee capable Launchpad devices
*/
/*
	Module dependencies
*/
const _ = require("lodash");
const bindDeep = require("bind-deep");
const {properties, events} = require("../../mixin.js");


// Text Scrolling across the pad
const marquee = function(text, color = "white", loop = 0) {
	color = this.constructor.color.normalize(color);
	if (text) {
		text = this.marquee.normalize(text);
	} else {
		text = [0];
	}
	loop = +loop; // true, 1 => 1; false, 0, "" => 0

	if (Array.isArray(color)) {
		// RGB
		throw new TypeError("Marquee can't be used with an RGB color via MIDI.");
	} else if (typeof color === "number") {
		// Basic
		this.send.sysex([this.constructor.sysex.prefix, 20, color, loop, text]);
	}

	// Return promise to detect loop or stop (stopMarquee or finished)
	// This will only resolve once but looping may cause the event to fire after a single "marquee" event
	// 0 => never timeout - since the text may be long
	return this.promiseOnce("marquee", 0);
};
// Stop the marquee
marquee.stop = function() {
	return this.marquee();
};
marquee.normalize = function(text) {
	let result = [];
	if (Array.isArray(text)) {
		for (const object of text) {
			if (typeof object === "string") {
				// Recursive with each string
				result.push(this.marquee.normalize(object));
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
};


module.exports = function() {
	// Properties
	properties(
		// Object to mix into
		this,

		// Instance
		{
			"marquee": {
				get() {
					return Object.defineProperty(this, "marquee", {
						"value": bindDeep(this, marquee)
					}).marquee;
				}
			}
		}
	);


	// Events
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
		"matches": this.sysex.manufacturer
	};
	const modelId = {
		"matches": this.sysex.model
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
