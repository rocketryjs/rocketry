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
// ButtonArray
const ButtonArray = require("../button-array.js");
// Mixin
const mixin = require("../../mixin.js");
const methods = mixin.methods;

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
	}
	for (const toMix of mixins) {
		mixin(ButtonExtended, `./launchpad/mixins/button/${toMix}.js`);
	}


	// Methods
	methods(
		// Object to mix into
		this,

		// Instance
		{
			// Get buttons
			get(...values) {
				return new ButtonArray(this, ...values);
			},
			getFromCoords(...coords) {
				const values = [];

				for (const coord of coords) {
					values.push({
						"column": coord.column || coord.x || coord[0],
						"row": coord.row || coord.y || coord[1]
					});
				}

				return this.get(...values);
			},
			getFromGridCoords(...coords) {
				const values = [];

				// Grid range, exclusive on the ceiling (1 - 8 inclusive)
				const range = [1, 9];

				for (const coord of coords) {
					const x = (coord.column || coord.x || coord[0]) + 1;
					const y = (coord.row || coord.y || coord[1]) + 1;

					if (_.inRange(x, ...range) && _.inRange(y, ...range)) {
						values.push([x, y]);
					} else {
						throw new RangeError(`(${x}, ${y}) is not in range of the grid.`);
					}
				}

				// Get from coords with the ajusted x and y
				return this.getFromCoords(...values);
			},
			getColumn(...columns) {
				const values = [];

				// Column range, exclusive on the ceiling (0 - 8 inclusive)
				const range = [0, 9];

				for (const column of columns) {
					if (_.inRange(column, ...range)) {
						values.push({column});
					} else {
						throw new RangeError(`Column ${column} is not in range.`);
					}
				}

				return this.get(...values);
			},
			getRow(...rows) {
				const values = [];

				// Row range, exclusive on the ceiling (0 - 8 inclusive)
				const range = [0, 9];

				for (const row of rows) {
					if (_.inRange(row, ...range)) {
						values.push({row});
					} else {
						throw new RangeError(`Row ${row} is not in range.`);
					}
				}

				return this.get(...values);
			},
			getQuadrant(...quadrants) {
				const values = [];

				// Quadrant range, exclusive on the ceiling (0 - 3 inclusive)
				const range = [0, 4];

				for (const quadrant of quadrants) {
					if (_.inRange(quadrant, ...range)) {
						values.push({quadrant});
					} else {
						throw new RangeError(`Quadrant ${quadrant} is not in range.`);
					}
				}

				return this.get(...values);
			},
			getTop() {
				return this.get({
					"group": "top"
				});
			},
			getRight() {
				return this.get({
					"group": "right"
				});
			},
			getBottom() {
				return this.get({
					"group": "bottom"
				});
			},
			getLeft() {
				return this.get({
					"group": "left"
				});
			},
			getGrid() {
				return this.get({
					"group": "grid"
				});
			},
			getAll() {
				// Return buttons already associated with the instance
				// or generate all buttons from values
				return this.buttons ? this.buttons : new ButtonArray(this, ...this.constructor.values);
			}
		},

		// Static
		{
			// The button class to use for this device
			"Button": ButtonExtended
		}
	);

	// Return object
	return this;
};
