/*
	Module: Launchpad layout methods
	Description: Methods for layouts
*/


module.exports = {
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
};
