/*
	Module: Launchpad layout static mixin
	Description: Methods for layouts
*/
/*
	Module dependencies
*/
const _ = require("lodash");
const {methods} = require("../../mixin.js");


module.exports = function() {
	// Methods
	methods(
		// Object to mix into
		this,

		// Instance
		{
			// Change layouts
			changeLayout(layout) {
				// Normalize
				layout = this.constructor.normalizeLayout(layout);

				// Send
				return this.sendSysEx([34, layout]);
			},
			resetLayout() {
				return this.changeLayout(0);
			}
		},

		// Static
		{
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
		}
	);
};
