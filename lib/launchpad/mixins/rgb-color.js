/*
	Module: Launchpad RGB color mixin
	Description: Methods for RGB color capable Launchpad devices
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
		// Object to mix into
		this,

		// Instance
		{
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
		},

		// Static
		{
			// RGB color names and ranges
			// Note: You can change these values at runtime. Read about how to do this on the GitHub wiki.
			"color": {
				"names": {
					"red": 5,
					"pink": 95,
					"fuchsia": 58,
					"purple": 55,
					"deep purple": 81,
					"indigo": 50,
					"blue": 45,
					"light blue": 41,
					"cyan": 37,
					"teal": 65,
					"green": 23,
					"light green": 21,
					"lime": 17,
					"yellow": 62,
					"amber": 61,
					"orange": 9,
					"deep orange": 11,
					"brown": 83,
					"sepia": 105,
					"gray": 71,
					"grey": "gray",
					"blue gray": 103,
					"blue grey": "blue gray",
					"white": 3,
					"black": "off",
					"off": 0
				},
				"basic": {
					"range": [0, 128] // Range, exclusive on ceiling
				},
				"rgb": {
					"range": [0, 64] // Range, exclusive on ceiling
				}
			},

			// Validates colors, finds colors from their names, and normalizes formats from many into a single one for each RGB and standard colors for internal use.
			normalizeColor(color) {
				// Validate and normalize colors for use in commands
				let result;
				let valid;

				// Named basic or RGB color
				if (typeof color === "string") {
					// From color names
					return this.normalizeColor(this.color.names[color]);
				}

				// Values
				if (typeof color === "object") {
					// RGB: {red, green, blue} or {r, g, b} or [red, green, blue], fallback on 0 in case of falsy values like 0
					result = [];
					result[0] = color.red || color.r || color[0] || 0;
					result[1] = color.green || color.g || color[1] || 0;
					result[2] = color.blue || color.b || color[2] || 0;

					const range = this.color.rgb.range;
					valid = result.every(value => {
						return _.inRange(value, ...range);
					}, this);
				} else {
					// Basic: user color name or defaults color name for the device or use number
					result = color;

					const range = this.color.basic.range;
					valid = _.inRange(result, ...range);
				}

				// Exit
				if (!valid) {
					throw new RangeError(`Color: ${color}, isn't in the accepted range.`);
				}
				return result;
			}
		}
	);
};
