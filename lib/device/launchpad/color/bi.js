/*
	Module: Bi-color
	Description: Color names and ranges for bi-color capapble Launchpad devices

	Note: You can change these values at runtime. Read about how to do this on the GitHub wiki.
	TODO: test flashing off without setting it to off ([0, 0, "flash"] => 8?)
*/
/*
	Module dependencies
*/
// lodash
const _ = require("lodash");


module.exports = {
	get(red, green, flag) {
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
	},
	"names": {
		// Red
		"red": "bright red",
		"dark red": [0, 1],
		"medium red": [0, 2],
		"bright red": [0, 3],
		// Amber
		"amber": "bright amber",
		"dark amber": [1, 1],
		"medium amber": [2, 2],
		"bright amber": [3, 3],
		// Yellow
		"yellow": "bright yellow",
		"medium yellow": [2, 1],
		"bright yellow": [3, 2],
		// Green
		"green": "bright green",
		"dark green": [1, 0],
		"medium green": [2, 0],
		"bright green": [3, 0],
		// Off
		"black": "off",
		"off": [0, 0]
	},
	"range": [0, 63] // Range, exclusive on ceiling
};
