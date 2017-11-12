/*
	Launchpad MK2 Config

	TODO: default file
*/
// Use shared color values between Launchpad RGB devices
const colors = require("./rgb-colors.js");


const data = {
	"buttons": {
		"top": {
			"_header": 176,
			"up": 104,
			"down": 105,
			"left": 106,
			"right": 107,
			"session": 108,
			"user 1": 109,
			"user 2": 110,
			"mixer": 111
		},
		"right": {
			"_header": 144,
			"volume": 89,
			"pan": 79,
			"send a": 69,
			"send b": 59,
			"stop": 49,
			"mute": 39,
			"solo": 29,
			"record arm": 19
		},
		"pad": {
			"_header": 144,
			"x": [0, 8],
			"y": [0, 8],
			"offset": {
				"x": 1,
				"y": 1
			}
		}
	},
	colors,
	"send": {
		"light": ["header", "led", "color"],
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
		"flash": {
			"message": [35, 0, "led", "color"],
			"type": "sysex"
		},
		"pulse": {
			"message": [40, 0, "led", "color"],
			"type": "sysex"
		},
		"light rgb": {
			"message": [10, "led", "color"],
			"type": "sysex"
		},
		"change layout": {
			"message": [34, "layout"],
			"type": "sysex"
		},
		"initialise fader": {
			"message": [43, "number", "type", "color", "value"],
			"type": "sysex"
		},
		"text scroll": {
			"message": [20, "color", "loop", "text"],
			"type": "sysex"
		}
	},
	"receive": {
		"press": ["header", "location", 127],
		"release": ["header", "location", 0]
	},
	"sysex": {
		"prefix": [240, 0, 32, 41, 2, 24],
		"suffix": 247
	}
};


module.exports = data;
