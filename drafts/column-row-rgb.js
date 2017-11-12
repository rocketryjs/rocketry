static _setColor(value, color, launchpad) {
	if (typeof color === "object") {
		// RGB: done with multiple SysEx commands
		let direction;
		if (classNameLower === "column") {
			direction = "x";
		} else if (classNameLower === "row") {
			direction = "y";
		}

		// Get values in row
		const range = _.range(...launchpad.getConfig("buttons.pad")[direction]);
		const config = launchpad.getConfig("buttons.pad.offset");

		// Send multple RGB commands
		for (let i = 0; i < range.length; i++) {
			// 0, 1, [...] => 11, 12, [...]
			_core.send("light rgb", {led: parseInt(`${value + config[direction]}${range[i] + config[direction]}`), color}, launchpad);
		}
	} else if (typeof color === "number") {
		// Basic
		_core.send(`light ${classNameLower}`, {[classNameLower]: value, color}, launchpad);
	}
}
