// Get buttons TODO
getButton(...values) {
	// TODO: move, fix, meta program in original methods
	const buttonsProto = {
		"test": function() {
			console.log("yuay");
		}
	};
	// Set values
	const buttons = [];
	// Arrays of coordinate pairs, object of MIDI values or coordinate pairs
	for (const value of values) {
		buttons.push(
			new this.Button(
				this._normalizeButtonValues(value)
			)
		);
	}

	// Return array of `Button`s with the interaction methods
	// Flatten out the arrays TODO?
	return _.flattenDeep(
		// Return and mutate the `buttons` array
		Object.assign(
			buttons,
			// Add the methods from `buttonsProto`
			buttonsProto
		)
	);
}
// Aliases for getButton
getButtons() {
	return this.getButton(...arguments);
}
// Get column
getColumn(value) {

}
// Get row
getRow(value) {

}
// Get pad
getPadButtons() {
	return this.getButton("pad");
}
getPad() {
	return this.getPadButtons();
}
// Get all buttons
getAllButtons() {
	return this.getButton("all");
}
getAll() {
	return this.getAllButtons();
}


// Normalization of arguments for MIDI
// Passes along x and y values, normalizes formats of note and header values
normalizeButtonValues(object) {
	if (object.x && object.y) {
		// keys => x, y
		return this.normalizeButtonCoords(object.x, object.y);
	} else if (Array.isArray(object)) {
		// [x, y]
		return this.normalizeButtonCoords(object[0], object[1]);
	} else if (typeof object.note === "number") {
		// keys => header?, value
		const header = object.header || this.buttonConfig.pad.header;
		return {
			header,
			"note": object.note
		};
	} else if (object === "pad") {
		// whole pad
		const xRange = _.range(...this.buttonConfig.pad.range.x);
		const yRange = _.range(...this.buttonConfig.pad.range.y);
		for (const x of xRange) {
			for (const y of yRange) {
				this.normalizeButtonCoords(x, y);
			}
		}
	} else if (typeof object === "string" && (object = _.at(this.buttonConfig, object)[0])) {
		// from config
		if (!object.note && !object.x) {
			// object of buttons
			for (const key in object) {
				this.normalizeButtonValues(object[key]);
			}
		} else {
			// single button
			this.normalizeButtonValues(object);
		}
	} else {
		throw new TypeError("Invalid button location.");
	}
}

// Validates x and y values, normalizes formats
normalizeButtonCoords(x, y) {
	// Validate
	// Not number or not in range of the device's pad
	if (!_.inRange(x, ...this._buttons.pad.range.x) || !_.inRange(y, ...this._buttons.pad.range.y)) {
		throw new RangeError("One or more coordinates either isn't a number or in the pad range for your device.");
	}

	// Set values
	this.values.push({
		"header": this._buttons.pad.header,
		"note": parseInt(`${y + this._buttons.pad.offset.y}${x + this._buttons.pad.offset.x}`)
	});
}
