/*
	Module: Launchpad MK2
	Description: Class for the Launchpad MK2 device
*/
import Device from "../device";
// Mixins
import color from "./mixins/rgb-color";
import marquee from "./mixins/marquee";
import clock from "./mixins/clock";
import layout from "./mixins/layout";
import inquiry from "./mixins/inquiry";
import query from "./mixins/query";
import fader from "./mixins/fader";
import button from "./mixins/button";
import {light, dark, flash, pulse} from "./mixins/button/rgb-color";


/*
	Generation of button values
*/
const buttonValues = (() => {
	const values = [];
	const range = [...Array(8).keys()];

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
				"note": new Proxy({}, {
					get(target, property) {
						if (property === "1") {
							// Note for layouts[1]
							return 36 + (4 * y) + x + (x <= 3 ? 0 : 28);
						} else {
							// Default
							return (10 * y) + x + 11;
						}
					}
				})
			});
		}

		// Right
		values.push({
			"name": rightNames[y],
			"group": "right",
			"status": "note on",
			"column": 8,
			"row": y,
			"note": new Proxy({}, {
				get(target, property) {
					if (property === "1") {
						// Note for layouts[1]
						return 100 + y;
					} else {
						// Default
						return (10 * y) + 19;
					}
				}
			})
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
			"note": new Proxy({}, {
				get() {
					// Default
					return 104 + x;
				}
			})
		});
	}

	return values;
})();

/*
	SysEx information
*/
const sysexInformation = (() => {
	// SysEx Manufacturer ID for Focusrite/Novation
	// https://www.midi.org/specifications/item/manufacturer-id-numbers
	const manufacturer = [0, 32, 41];
	// [product type, product number]
	const model = [2, 24];
	const prefix = [...manufacturer, ...model];

	return {manufacturer, model, prefix};
});


/*
	Launchpad MK2 Class
*/
@color
@marquee
@clock
@layout
@inquiry
@query
@fader
@button
@light
@dark
@flash
@pulse
export default class LaunchpadMk2 extends Device {
	constructor() {
		// Device, EventEmitter
		super(...arguments);
	}

	// Full reset
	// The MK2 ignores all reset commands from the MIDI spec I tested and
	// doesn't document their own in the reference so...
	reset() {
		this.clock.reset();
		this.layout.reset();
		this.marquee.reset();
		this.light.reset();

		// Method chaining
		return this;
	}

	// Layouts regex and channels (to allow config of user 1 and 2)
	layouts = [
		{
			"regex": /Session|Default/i,
			"channel": 1
		},
		{
			"regex": /User 1|Drum|Rack/i,
			"channel": 6
		},
		{
			"regex": /User 2/i,
			"channel": 14
		},
		{
			"regex": /Reserved|Ableton|Live/i,
			"channel": 1
		},
		{
			"regex": /Volume|^Fader$/i,
			"channel": 1
		},
		{
			"regex": /Pan/i,
			"channel": 1
		},
	]
	// Button values
	static values = buttonValues;
	// SysEx information
	static sysex = sysexInformation;
	// Device type name, key for `rocketry.devices`, etc
	static type = "Launchpad MK2";
}
