/*
	Module: Launchpad layout static methods
	Description: Static methods for layouts
*/
/*
	Module dependencies
*/
// lodash
const _ = require("lodash");


module.exports = {
	// Validate and normalize layouts
	normalizeLayout(layout) {
		if (typeof layout !== "number") {
			for (let i = 0; i < this.layouts.length; i++) {
				if (this.layouts[i].test(layout)) {
					layout = i;
					break;
				}
			}
		}

		// Return layout if a number in range
		if (_.inRange(layout, 0, this.layouts.length)) {
			return layout;
		} else {
			throw new RangeError(`Layout ${layout} isn't a valid layout for this device.`);
		}
	}
};
