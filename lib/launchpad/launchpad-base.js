/*
	Module: Launchpad base
	Description: The basic code all Launchpad devices have in class form to be extended
*/
/*
	Module dependencies
*/
// Device class
const Device = require("../device.js");
// ButtonArray (TODO: each subclass ButtonArray?)
const ButtonArray = require("./button/array.js");
// lodash
const _ = require("lodash");


/*
	Launchpad Class
*/
class Launchpad extends Device {
	constructor() {
		// Device, EventEmitter
		super(...arguments);

		// Allow responses of SysEx messages
		this.input.ignoreTypes(false, true, false);

		// Generate all buttons from values
		this.buttons = new ButtonArray(this, ...this.constructor.values);
	}


	// Get buttons
	get(...values) {
		return new ButtonArray(this, ...values);
	}
	getFromCoords(...coords) {
		const values = [];

		for (const coord of coords) {
			values.push({
				"column": coord.column || coord.x || coord[0],
				"row": coord.row || coord.y || coord[1]
			});
		}

		return this.get(...values);
	}
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
	}
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
	}
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
	}
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
	}
	getTop() {
		return this.get({
			"group": "top"
		});
	}
	getRight() {
		return this.get({
			"group": "right"
		});
	}
	getBottom() {
		return this.get({
			"group": "bottom"
		});
	}
	getLeft() {
		return this.get({
			"group": "left"
		});
	}
	getGrid() {
		return this.get({
			"group": "grid"
		});
	}
	getAll() {
		// Return buttons already associated with the instance
		return this.buttons;
	}


	static get sysExManufacturerId() {
		return [0, 32, 41];
	}
	static is(object) {
		return object instanceof this;
	}
}


module.exports = Launchpad;
