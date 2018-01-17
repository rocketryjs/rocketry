/*
	Module: Launchpad MIDI clock mixin
	Description: Methods for MIDI clock capable Launchpad devices
*/
/*
	Module dependencies
*/
const {methods} = require("../../mixin.js");


module.exports = function() {
	// Methods, return object
	return methods(
		// Object to mix into
		this,

		// Instance
		{
			clearMidiClock() {
				// Stop the interval
				clearInterval(this.midiClockInterval);
				delete this.midiClockInterval;
			},
			changeMidiClock(
				// Beats per minute
				bpm,
				// Will stop after 48 messages (2 beats) by default
				maxReps = 48
			) {
				// Save
				this.midiClockBpm = bpm;

				// Clear if called before last one was stopped
				this.clearMidiClock();

				// Stop sending MIDI clock messages when closing the device
				// clearMidiClock or reset should be run before close,
				// this only prevents extra messages
				if (!this.listeners("close").includes(this.clearMidiClock)) {
					this.once("close", () => {
						this.clearMidiClock.apply(this);
					});
				}

				let reps = 0;
				this.midiClockInterval = setInterval(
					// Call MIDI clock
					() => {
						// Will stop after reached maxReps if not 0 or otherwise falsy
						if (reps < maxReps || !maxReps) {
							this.send([248]);
							reps++;
						} else {
							this.clearMidiClock.apply(this);
						}
					},
					// Timing formula: 1000 / messages per second
					// Messages per second: messages per minute / 60
					// Messages per minute: 24 pulses per beat
					1000 / (bpm * 24 / 60)
				);

				// Method chaining
				return this;
			},
			resetMidiClock() {
				// Reset to 120bpm if the bpm is set to something other than 120
				if (typeof this.midiClockBpm !== "undefined" && this.midiClockBpm !== 120) {
					return this.changeMidiClock(120);
				}
			}
		}
	);
};
