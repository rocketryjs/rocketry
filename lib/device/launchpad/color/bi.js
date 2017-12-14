/*
	Module: Bi-color
	Description: Color names and ranges for bi-color capapble Launchpad devices

	Note: You can change these values at runtime. Read about how to do this on the GitHub wiki.
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
			case "double-buffer": {
				flag = 0;
				break;
			}
			case "flash": {
				flag = 8;
				break;
			}
			case "normal":
				// fallthrough
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
		"light": {
			"red": "bright red",
			"dark red": 13,
			"bright red": 15,
			"amber": "bright amber",
			"dark amber": 29,
			"bright amber": 63,
			"yellow": "bright yellow",
			"bright yellow": 62,
			"green": "bright green",
			"dark green": 28,
			"bright green": 60,
			"black": "off",
			"off": 12
		},
		"flash": {
			"red": 11,
			"amber": 59,
			"green": 56,
			"black": "off",
			"off": 8 // TODO: test
		}
	},
	"range": [0, 63] // Range, exclusive on ceiling
};
