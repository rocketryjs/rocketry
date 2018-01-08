/*
	Module: Launchpad events
	Description: All possible events for Launchpads
*/
/*
	Module dependencies
*/
// lodash
const _ = require("lodash");


// Shared bytes
const status = {
	"min": 1,
	"max": 1,
	validate(value) {
		return _.inRange(value, 144, 160) || _.inRange(value, 176, 192);
	}
};
const note = {
	"min": 1,
	"max": 1,
	validate(value) {
		return _.inRange(value, 0, 128);
	}
};
const footer = {
	"matches": [247]
};
const data = {
	"min": 0,
	"max": Infinity
};



module.exports = {
	// When pressing a button
	"press": {
		status,
		note,
		"pressure": {
			"min": 1,
			"max": 1,
			validate(value) {
				return _.inRange(value, 1, 128);
			}
		}
	},
	// When releasing a button
	"release": {
		status,
		note,
		"pressure": {
			"matches": [0],
		}
	},
	// Response from device inquiry
	"device": {
		"header": {
			"matches": [240, 126, 0, 6, 2]
		},
		data,
		footer
	},
	// Response from version inquiry
	"version": {
		"header": {
			"matches": [240, 0, 32, 41, 0, 112]
		},
		data,
		footer
	}
};
