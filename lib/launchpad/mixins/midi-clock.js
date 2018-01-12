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
				if (this.midiClockId) {
					clearInterval(this.midiClockId);
				}
			},
			changeMidiClock(bpm) {
				// Clear if called before last stopped
				this.clearMidiClock();

				// Stop sending MIDI clock messages when closing the device
				this.once("close", this.clearMidiClock);

				this.midiClockId = setInterval(
					// Call MIDI clock
					() => {
						this.send([248]);
					},
					// Timing
					1000 / (bpm * 24 / 60)
				);

				// Stop sending in two seconds (all supported BPM's seem to work after being called for over a second)
				setTimeout(this.clearMidiClock, 2000);

				// Method chaining
				return this;
			},
			resetMidiClock() {
				return this.changeMidiClock(120);
			}
		}
	);
};
