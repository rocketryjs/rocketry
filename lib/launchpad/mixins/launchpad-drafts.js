/*
	This should be the prototype also added to a button arry for queried columns, rows, grid, all, group
*/


{
	// Color
	light(...colors) {
		/*
			Proxy launchpad.light, and reflect if the first condition
		*/
		if (colors.length > 1) {
			// Remember SysEx RGB grid for Pro
			const buttons = this.query.all.by[whoami](whichami);
			buttons.light(...colors);
		} else {
			// Make repeating for columns and rows
			this.sendSysEx(14, colors[0]);
		}

		// Method chaining
		return theButtonArray;
	},
	dark() {
		return this.light("off");
	},
	flash(...colors) {

		// Method chaining
		return theButtonArray;
	},
	stopFlash() {

		// Method chaining
		return theButtonArray;
	},
	pulse(...colors) {
		// Method chaining
		return theButtonArray;
	},
	stopPulse() {

		// Method chaining
		return theButtonArray;
	}
},
