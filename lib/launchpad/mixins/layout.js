/*
	Module: Launchpad layout mixin
	Description: Methods for layouts
*/
/*
	Module dependencies
*/
const _ = require("lodash");
const bindDeep = require("bind-deep");
const {properties} = require("../../mixin.js");


const layout = {};
// Change layouts
layout.change = function(layout) {
	// Normalize
	layout = this.layout.normalize(layout);

	// Save
	this.layout.current = layout;

	// Send
	return this.send.sysex([this.constructor.sysex.prefix, 34, layout]);
};
layout.set = layout.change;
layout.reset = function() {
	return this.layout.change(0);
};
// Validate and normalize layouts
layout.normalize = function(layout) {
	if (typeof layout !== "number") {
		for (let i = 0; i < this.constructor.layouts.length; i++) {
			if (this.constructor.layouts[i].test(layout)) {
				layout = i;
				break;
			}
		}
	}

	// Return layout if a number in range
	if (_.inRange(layout, 0, this.constructor.layouts.length)) {
		return layout;
	} else {
		throw new RangeError(`Layout ${layout} isn't a valid layout for this device.`);
	}
};


module.exports = function() {
	// Properties
	properties(
		// Object to mix into
		this,

		// Instance
		{
			"layout": {
				get() {
					return Object.defineProperty(this, "layout", {
						"value": bindDeep(this, layout)
					}).layout;
				},
			}
		}
	);
};
