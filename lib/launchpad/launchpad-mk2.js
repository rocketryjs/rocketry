/*
	Module: Launchpad MK2
	Description: Class for the Launchpad MK2 device
*/
/*
	Module dependencies
*/
// lodash
const _ = require("lodash");
// Mixin
const mixin = require("../mixin.js");
// Device class
const Device = require("../device.js");


/*
	Launchpad MK2 Class
*/
class LaunchpadMk2 extends Device {
	constructor() {
		// Device, EventEmitter
		super(...arguments);

		// Keep list of buttons by generating all buttons from values
		this.buttons = this.getAll();
	}


	// Full reset
	reset() {
		this.resetMidiClock();
		this.resetLayout();
		this.stopScrollText();
		this.dark();

		// Method chaining
		return this;
	}


	// Smart getters
	// Layouts regex
	static get layouts() {
		delete this.layouts;
		return this.layouts = [
			/Session/i,
			/User 1|Drum Rack/i,
			/User 2/i,
			/Reserved|Ableton|Live/i,
			/Fader/i,
			/Pan/i
		];
	}
	// Button values
	static get values() {
		const values = [];
		const range = _.range(0, 8);

		// Top
		const topNames = ["up", "down", "left", "right", "session", "user 1", "user 2", "mixer"];
		for (const x of range) {
			values.push({
				"name": topNames[x],
				"group": "top",
				"status": "control change",
				"column": x,
				"row": 8,
				"note": 104 + x
			});
		}
		// Right
		const rightNames = ["record arm", "solo", "mute", "stop", "send b", "send a", "pan", "volume"];
		for (const y of range) {
			values.push({
				"name": rightNames[y],
				"group": "right",
				"status": "note on",
				"column": 8,
				"row": y,
				"note": (10 * y)  + 19
			});
		}
		// Grid
		for (const x of range) {
			for (const y of range) {
				// Quadrant
				let quadrant = 0;
				if (x > 3) {
					quadrant += 1;
				}
				if (y > 3) {
					quadrant += 2;
				}

				// Push to values
				values.push({
					"status": "note on",
					"group": "grid",
					"column": x,
					"row": y,
					quadrant,
					"note": (10 * y) + x + 11
				});
			}
		}

		delete this.values;
		return this.values = values;
	}
	// TODO: comment
	static get sysExModelId() {
		delete this.sysExModelId;
		return this.sysExModelId = [
			// Product type
			2,
			// Product number
			24
		];
	}
	// SysEx Manufacturer ID for Focusrite/Novation
	// https://www.midi.org/specifications/item/manufacturer-id-numbers
	static get sysExManufacturerId() {
		delete this.sysExManufacturerId;
		return this.sysExManufacturerId = [0, 32, 41];
	}

	// TODO use name that doesn't conflict with function.prototype, make smart getter?
	// TODO: comment
	static get name() {
		// delete this.name;
		// return this.name =
		return "Launchpad MK2";
	}
}


/*
	Mixins
*/
// Instance and static methods
for (const toMix of [
	"rgb-color",
	"scroll-text",
	"midi-clock",
	"layout",
	"inquiry"
]) {
	mixin(LaunchpadMk2, `./launchpad/mixins/${toMix}.js`);
}

// Button(s)
mixin(LaunchpadMk2, "./launchpad/mixins/button.js", ["rgb-color"]);


module.exports = LaunchpadMk2;
