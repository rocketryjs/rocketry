/*
	Module: Launchpad buttons mixin
	Description: Methods, properties, and events for Launchpad buttons
*/
/*
	Module dependencies
*/
// lodash
const _ = require("lodash");
// Button class
const Button = require("../button.js");
// Mixin
const mixin = require("../../mixin.js");
const {methods, properties} = mixin;


module.exports = function(mixins) {
	// Events
	// Add destination
	if (typeof this.events !== "object") {
		this.events = {};
	}

	// Shared functions
	const isNoteOn = function(value) {
		return _.inRange(value, 144, 160);
	};
	const isControlChange = function(value) {
		return _.inRange(value, 176, 192);
	};

	// Shared bytes
	const noCcStatus = {
		"min": 1,
		"max": 1,
		validate(value) {
			return isNoteOn(value) || isControlChange(value);
		},
		mutate(message) {
			if (isNoteOn(message.status)) {
				message.status = "note on";
			} else if (isControlChange(message.status)) {
				message.status = "control change";
			}
		}
	};
	const note = {
		"min": 1,
		"max": 1,
		validate(value) {
			return _.inRange(value, 0, 128);
		},
		mutate(message) {
			message.note = message.note[0];
		}
	};

	// Add button press and release events
	Object.assign(this.events, {
		// When pressing a button
		"press": {
			"status": noCcStatus,
			note,
			"pressure": {
				"min": 1,
				"max": 1,
				validate(value) {
					return _.inRange(value, 1, 128);
				},
				mutate(message) {
					message.pressed = true;
					message.pressure = message.pressure[0];
				}
			}
		},
		// When releasing a button
		"release": {
			"status": noCcStatus,
			note,
			"pressure": {
				"matches": [0],
				mutate(message) {
					message.pressed = false;
					message.pressure = 0;
				}
			}
		}
	});


	// Button class definition
	class ButtonExtended extends Button {
		constructor() {
			super(...arguments);
		}
		static is(object) {
			return object instanceof this;
		}
	}
	// Set device to class
	ButtonExtended.device = this;
	// Mixins for buttons
	for (const toMix of mixins) {
		mixin(ButtonExtended, `./launchpad/mixins/button/${toMix}.js`);
	}


	// Methods
	methods(
		// Object to mix into
		this,

		// Instance - none
		false,

		// Static
		{
			// The button class to use for this device
			"Button": ButtonExtended
		}
	);


	// Properties, return object
	return properties(
		// Object to mix into
		this,

		// Instance
		{
			// Smart getters
			// Object.defineProperty defines a prop for this so it doesn't override
			// this.prototype.buttons but won't be called again by this device. (~magic~)
			"buttons": {
				// Get buttons
				get() {
					// Generate all buttons from values
					const buttons = [];
					for (const value of this.constructor.values) {
						buttons.push(new this.constructor.Button(this, value));
					}

					return Object.defineProperty(this, "buttons", {
						"value": buttons
					}).buttons;
				},
			}
		}
	);
};
