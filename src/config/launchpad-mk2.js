/*
	Launchpad MK2 Config

	TODO: default file, use classes instead?, don't use keys since interation order isn't ensured, add better ranges for non-coord buttons to error better, add errors for text
*/
/*
	Module dependencies
*/
// lodash
const _ = require("lodash");


/*
	Sharing
*/
// Use shared color values between Launchpad RGB devices
const colors = require("./rgb-colors.js");


/*
	Generation
*/
// ...top,
// [0, 0, 0, 0, 0, 0, 0, 0, right[n],
// [0, 0, 0, 0, 0, 0, 0, 0, right[n],
// [0, 0, 0, 0, 0, 0, 0, 0, right[n],
// [0, 0, 0, 0, 0, 0, 0, 0, right[n],
// [0, 0, 0, 0, 0, 0, 0, 0, right[n],
// [0, 0, 0, 0, 0, 0, 0, 0, right[n],
// [0, 0, 0, 0, 0, 0, 0, 0, right[n],
// [0, 0, 0, 0, 0, 0, 0, 0, right[n]

const range = _.range(0, 8);
const offset = 1;


const top = {};
(() => {
	const buttons = ["up", "down", "left", "right", "session", "user 1", "user 2", "mixer"];
	for (let i = 0; i < buttons.length; i++) {
		const button = buttons[i];
		top[button] = {
			"header": 176,
			"note": 104 + i
		};
	}
})();


const right = {};
(() => {
	const buttons = ["record arm", "solo", "mute", "stop", "send b", "send a", "pan", "volume"];
	for (let i = 0; i < buttons.length; i++) {
		const button = buttons[i];
		right[button] = {
			"header": 144,
			"note": parseInt(`${(1 + i).toString()}9`)
		};
	}
})();

const pad = [];
(() => {
	for (const x of range) {
		pad[x] = [];
		for (const y of range) {
			pad[x][y] = {
				"header": 144,
				"note": parseInt(`${y + offset}${x + offset}`)
			};
		}
	}
})();

const all = pad;
(() => {
	// Add top
	all.unshift(top);

	// Add right
	for (const y of range) {
		// One past last x
		all[range.length][y] = right[i]; // TODO
	}
})();


const data = {
	"buttons": {
		top,
		right,
		all,
		pad
	},
	colors,
	"send": {
		"light": ["header", "led", "color"],
		"light rgb": {
			"message": [10, "led", "color"],
			"type": "sysex"
		},
		"light column": {
			"message": [12, "column", "color"],
			"type": "sysex"
		},
		"light row": {
			"message": [13, "row", "color"],
			"type": "sysex"
		},
		"light all": {
			"message": [14, "color"],
			"type": "sysex"
		},
		"scroll text": {
			"message": [20, "color", "loop", "text"],
			"type": "sysex"
		},
		"change layout": {
			"message": [34, "layout"],
			"type": "sysex"
		},
		"flash": {
			"message": [35, 0, "led", "color"],
			"type": "sysex"
		},
		"pulse": {
			"message": [40, 0, "led", "color"],
			"type": "sysex"
		},
		"initialize fader": {
			"message": [43, "number", "type", "color", "value"],
			"type": "sysex"
		}
	},
	"receive": {
		"press": ["header", "note", 127],
		"release": ["header", "note", 0]
	},
	"sysex": {
		"prefix": [240, 0, 32, 41, 2, 24],
		"suffix": 247
	}
};


module.exports = data;
