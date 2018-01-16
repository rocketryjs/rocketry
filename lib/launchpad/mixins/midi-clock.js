/*
	Module: Launchpad MIDI clock mixin
	Description: Methods for MIDI clock capable Launchpad devices
*/
/*
	Module dependencies
*/
// Node.js util (for timers)
require("util");
// Mixin
const {methods} = require("../../mixin.js");


module.exports = function() {
	// Methods, return object
	return methods(
		// Object to mix into
		this,

		// Instance
		{
			clearMidiClock() {
				// Clear the timeout that calls this
				clearTimeout(this.midiClockTimeout);
				delete this.midiClockTimeout;
				// Stop the interval
				clearInterval(this.midiClockInterval);
				delete this.midiClockInterval;
			},
			changeMidiClock(bpm) {
				// Save
				this.midiClockBpm = bpm;

				// Clear if called before last one was stopped
				this.clearMidiClock();

				// Stop sending MIDI clock messages when closing the device
				// clearMidiClock or reset should be run before close,
				// this only prevents extra messages
				this.once("close", this.clearMidiClock);

				this.midiClockInterval = setInterval(
					// Call MIDI clock
					() => {
						this.send([248]);
					},
					// Timing
					1000 / (bpm * 24 / 60)
				);

				// Stop sending in two seconds (all supported BPM's seem to work after being called for over a second)
				this.midiClockTimeout = setTimeout(this.clearMidiClock, 2000);

				// Method chaining
				return this;
			},
			resetMidiClock() {
				// Reset if the BPM isn't 120
				if (this.midiClockBpm !== 120) {
					return this.changeMidiClock(120);
				}
			}
		}
	);
};
