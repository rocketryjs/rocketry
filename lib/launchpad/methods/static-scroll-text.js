/*
	Module: Launchpad static text scrolling methods
	Description: Static methods for scrollText capable Launchpad devices
*/
/*
	Module dependencies
*/
// lodash
const _ = require("lodash");


module.exports = {
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
};
