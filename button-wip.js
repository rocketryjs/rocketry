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










// Interaction
// Color
setColor(color) {
	color = this.constructor.launchpad.constructor.normalizeColor(color);

	let mode;
	if (typeof color === "object") {
		// RGB
		mode = "light rgb";
	} else if (typeof color === "number") {
		// Basic
		mode = "light";
	}

	for (const value of this.values) {
		// Send to core, extra arguments are ignored so no need to remove the header for RGB mode
		core.send(mode, {"header": value.header, "led": value.note, color}, this.constructor.launchpad);
	}

	// Method chaining
	return this;
}
// Aliases for setColor
set color(color) {
	this.setColor(color);
}
light(color) {
	return this.setColor(color);
}
dark() {
	return this.setColor("off");
}
// Flashing
flash(color) {
	color = this.constructor.launchpad.constructor.normalizeColor(color);

	if (Array.isArray(color)) {
		// RGB
		throw new TypeError("Flashing can't be used with an RGB color via MIDI.");
	} else if (typeof color === "number") {
		// Basic
		for (const value of this.values) {
			core.send("flash", {"led": value.note, color}, this.constructor.launchpad);
		}
	}

	// Method chaining
	return this;
}
stopFlash() {
	return this.flash("off");
}
// Pulsing
pulse(color) {
	color = this.constructor.launchpad.constructor.normalizeColor(color);

	if (Array.isArray(color)) {
		// RGB
		throw new TypeError("Pulsing can't be used with an RGB color via MIDI.");
	} else if (typeof color === "number") {
		// Basic
		for (const value of this.values) {
			core.send("pulse", {"led": value.note, color}, this.constructor.launchpad);
		}
	}

	// Method chaining
	return this;
}
stopPulse() {
	return this.pulse("off");
}
