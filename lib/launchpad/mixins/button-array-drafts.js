/*
	Module: ButtonArray RGB color light, flash, and pulse mixin
	Description: Methods for lighting, flashing, and pulsing RGB color capable Launchpad devices' ButtonArrays
*/
/*
	Module: Launchpad RGB button repeating mixin
	Description: Methods for RGB color capable Launchpad devices' buttons
*/
/*
	Module dependencies
*/
const bindDeep = require("bind-deep");
const {properties} = require("../../../mixin.js");


const makeRepeating = function(saveLoc, ...colors) {
	const patternGen = function*(colors) {
		// Normalize all once
		for (let i = 0; i < colors.length; i++) {
			colors[i] = this.device.constructor.color.normalize(colors[i]);
		}
		let i = 0;
		while (true) {
			if (i < colors.length) {
				i = 0;
			}

			// Yield next or first color
			yield colors[i];

			i++;
		}
	};

	const pattern = patternGen(colors);
	const messages = {
		"standard": [],
		"rgb": []
	};
	const layout = this.layout.current;
	for (const button of this.buttons) {
		// Get next color
		const color = pattern.next().value;

		// Save
		button.color[saveLoc] = color;
		// Add color and note to message type array
		messages[color.type].push(button.note[layout], color);
	}

	return messages;
};


// Lighting
const light = function(...colors) {
	// Make messages
	const messages = this.makeRepeating.call(this, "light", ...colors);

	// Send
	for (const key in messages) {
		if (messages[key].length > 0) {
			if (key === "rgb") {
				this.sendSysEx(11, messages);
			} else if (key === "standard") {
				this.sendSysEx(10, messages);
			}
		}
	}

	// Method chaining
	return this;
};
light.stop = function() {
	return this.light("off");
};
light.reset = light.stop;


// Flashing
const flash = function(...colors) {
	// Make messages
	const messages = this.makeRepeating.call(this, "flash", ...colors);

	// Send
	for (const key in messages) {
		if (messages[key].length > 0) {
			if (key === "rgb") {
				throw new TypeError("Flashing can't be used with an RGB color via MIDI.");
			} else if (key === "standard") {
				this.sendSysEx(35, messages);
			}
		}
	}

	// Method chaining
	return this;
};
flash.stop = function() {
	// Re-light or pulse color
	if (this.pulse.current) {
		this.pulse(this.pulse.current);
	} else if (this.light.current) {
		this.light(this.light.current);
	} else {
		// Stop flashing
		this.dark();
	}

	// Method chaining
	return this;
};
flash.reset = flash.stop;


// Pulsing
const pulse = function(...colors) {
	// Make messages
	const messages = this.makeRepeating.call(this, "pulse", ...colors);

	// Send
	for (const key in messages) {
		if (messages[key].length > 0) {
			if (key === "rgb") {
				throw new TypeError("Pulsing can't be used with an RGB color via MIDI.");
			} else if (key === "standard") {
				this.sendSysEx(40, messages);
			}
		}
	}

	// Method chaining
	return this;
},
pulse.stop = function() {
	return this.pulse("off");
};
pulse.reset = pulse.stop;


module.exports = function() {
	// Properties
	properties(
		// Object to mix into
		this,

		// Instance
		{
			"light": {
				get() {
					return Object.defineProperty(this, "light", {
						"value": bindDeep(this, light)
					}).light;
				}
			},
			"dark": {
				get() {
					return this.light.stop;
				}
			},
			"flash": {
				get() {
					return Object.defineProperty(this, "flash", {
						"value": bindDeep(this, flash)
					}).flash;
				}
			},
			"pulse": {
				get() {
					return Object.defineProperty(this, "pulse", {
						"value": bindDeep(this, pulse)
					}).pulse;
				}
			}
		}
	);
};
