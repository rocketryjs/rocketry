/*
	Module: Launchpad MIDI clock mixin
	Description: Methods for MIDI clock capable Launchpad devices
*/
/*
	Module dependencies
*/
const bindDeep = require("bind-deep");
const {properties} = require("../../mixin.js");


const clock = {};
clock.clear = function() {
	// Stop the interval
	clearInterval(this.clock.interval);
	delete this.clock.interval;
};
clock.change = function(
	// Beats per minute
	bpm,
	// Will stop after 48 messages (2 beats) by default
	maxReps = 48
) {
	// Save
	this.clock.current = bpm;

	// Clear if called before last one was stopped
	this.clock.clear();

	// Stop sending MIDI clock messages when closing the device
	// `device.reset()` should be run before `device.close()` as this only prevents extra messages
	if (!this.closeListener) {
		this.closeListener = () => {
			this.clock.clear();
		};
		this.on("close", this.closeListener);
	}

	let reps = 0;
	this.clock.interval = setInterval(
		// Call MIDI clock
		() => {
			// Will stop after reached maxReps if not 0 or otherwise falsy
			if (reps < maxReps || !maxReps) {
				this.send([248]);
				reps++;
			} else {
				this.clock.clear();
			}
		},
		// Timing formula: 1000 / messages per second
		// Messages per second: messages per minute / 60
		// Messages per minute: 24 pulses per beat
		1000 / (bpm * 24 / 60)
	);

	// Method chaining
	return this;
};
clock.set = clock.change;
clock.reset = function() {
	// Reset to 120bpm if the bpm is set to something other than 120
	if (typeof this.clock.current !== "undefined" && this.clock.current !== 120) {
		return this.clock.change(120);
	}
};


module.exports = function() {
	// Properties
	properties(
		// Object to mix into
		this,

		// Instance
		{
			"clock": {
				get() {
					return Object.defineProperty(this, "clock", {
						"value": bindDeep(this, clock)
					}).clock;
				}
			}
		}
	);
};
