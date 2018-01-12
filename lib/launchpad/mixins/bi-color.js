/*
	Module: Launchpad bi-color mixin
	Description: Methods and properties for bi-color capable Launchpad devices
	TODO: test flashing off without setting it to off ([0, 0, "flash"] => 8?)
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
			// TODO
		},

		// Static
		{
			// RGB color names and ranges
			// Note: You can change these values at runtime. Read about how to do this in the docs.
			"color": {
				"names": {
					// Red
					"red": "bright red",
					"dark red": [1, 0],
					"medium red": [2, 0],
					"bright red": [3, 0],
					// Amber
					"amber": "bright amber",
					"dark amber": [1, 1],
					"medium amber": [2, 2],
					"bright amber": [3, 3],
					// Yellow
					"yellow": "bright yellow",
					"medium yellow": [1, 2],
					"bright yellow": [2, 3],
					// Green
					"green": "bright green",
					"dark green": [0, 1],
					"medium green": [0, 2],
					"bright green": [0, 3],
					// Off
					"black": "off",
					"off": [0, 0]
				},
				"range": [0, 63] // Range, exclusive on ceiling
			},

			// TODO
			normalizeColor(red, green, flag) {
				// Decimal color value creation according to the Launchpad Mini's programmer's reference
				switch (flag) {
					case 0:
					case "double-buffer": {
						flag = 0;
						break;
					}
					case 8:
					case "flash": {
						flag = 8;
						break;
					}
					case 12:
					case "normal":
					default: {
						// Normal use
						flag = 12;
					}
				}

				const result = (16 * green) + red + flag;
				if (_.inRange(result, ...this.range)) {
					return result;
				} else {
					throw new RangeError(`Color: ${red}, ${green}, ${flag} (${result}), isn't in the accepted range.`);
				}
			}
		}
	);
};
