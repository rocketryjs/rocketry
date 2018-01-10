/*
	Module: Launchpad RGB static methods
	Description: Static methods for RGB color capable Launchpad devices
*/
/*
	Module dependencies
*/
// lodash
const _ = require("lodash");


/*
	Code sharing
*/
// RGB color names and ranges
const color = require("../color/rgb.js");


module.exports = {
	// RGB color names and ranges
	color,

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
};
