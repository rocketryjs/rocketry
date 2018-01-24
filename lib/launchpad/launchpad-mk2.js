/*
	Module: Launchpad MK2
	Description: Class for the Launchpad MK2 device
*/
/*
	Module dependencies
*/
const _ = require("lodash");
const mixin = require("../mixin.js");
const Device = require("../device.js");


/*
	Launchpad MK2 Class
*/
class LaunchpadMk2 extends Device {
	constructor() {
		// Device, EventEmitter
		super(...arguments);
	}


	// Full reset
	// The MK2 ignores all reset commands from the MIDI spec I tested and
	// doesn't document their own in the reference so...
	reset() {
		this.resetMidiClock();
		this.resetLayout();
		this.stopMarquee();
		this.dark();

		// Method chaining
		return this;
	}


	// Smart getters - TODO move out?
	// Mixins
	// key => location
	// value => arguments such as "sub-mixins"
	static get mixins() {
		delete this.mixins;
		return this.mixins = {
			// Instance and static methods
			"rgb-color": [],
			"marquee": [],
			"midi-clock": [],
			"layout": [],
			"inquiry": [],
			"query": [],
			"fader": [],
			// Button mixin and its own mixins
			"button": [
				["rgb-color"]
			]
		};
	}
	// Layouts regex
	static get layouts() {
		delete this.layouts;
		return this.layouts = [
			/Session|Default/i,
			/User 1|Drum|Rack/i,
			/User 2/i,
			/Reserved|Ableton|Live/i,
			/Volume|^Fader$/i,
			/Pan/i
		];
	}
	// Button values
	static get values() {
		const values = [];
		const range = _.range(0, 8);

		// Grid and Right
		const rightNames = ["record arm", "solo", "mute", "stop", "send b", "send a", "pan", "volume"];
		for (const y of range) {
			for (const x of range) {
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

			// Right
			values.push({
				"name": rightNames[y],
				"group": "right",
				"status": "note on",
				"column": 8,
				"row": y,
				"note": (10 * y) + 19
			});
		}

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

		delete this.values;
		return this.values = values;
	}
	// Device type name, key for `rocket.devices`, etc
	static get type() {
		delete this.type;
		return this.type = "Launchpad MK2";
	}
}


/*
	SysEx information
*/
LaunchpadMk2.sysex = {
	get prefix() {
		delete this.prefix;
		return this.prefix = this.manufacturer.concat(this.model);
	},
	// SysEx Manufacturer ID for Focusrite/Novation
	// https://www.midi.org/specifications/item/manufacturer-id-numbers
	"manufacturer": [0, 32, 41],
	// Model information used in SysEx messages
	"model": [
		// Product type
		2,
		// Product number
		24
	]
};


/*
	Mixins
*/
// Instance, static methods, Button
for (const key in LaunchpadMk2.mixins) {
	const args = LaunchpadMk2.mixins[key];
	mixin(LaunchpadMk2, `./launchpad/mixins/${key}.js`, ...args);
}


module.exports = LaunchpadMk2;
