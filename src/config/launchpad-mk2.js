/*
	Launchpad MK2 Config

	TODO: default file, use classes instead?
*/
// Use shared color values between Launchpad RGB devices
const colors = require("./rgb-colors.js");


const data = {
	"buttons": {
		"top": {
			"up": {
				"header": 176,
				"note": 104
			},
			"down": {
				"header": 176,
				"note": 105
			},
			"left": {
				"header": 176,
				"note": 106
			},
			"right": {
				"header": 176,
				"note": 107
			},
			"session": {
				"header": 176,
				"note": 108
			},
			"user 1": {
				"header": 176,
				"note": 109
			},
			"user 2": {
				"header": 176,
				"note": 110
			},
			"mixer": {
				"header": 176,
				"note": 111
			}
		},
		"right": {
			"volume": {
				"header": 144,
				"note": 89
			},
			"pan": {
				"header": 144,
				"note": 79
			},
			"send a": {
				"header": 144,
				"note": 69
			},
			"send b": {
				"header": 144,
				"note": 59
			},
			"stop": {
				"header": 144,
				"note": 49
			},
			"mute": {
				"header": 144,
				"note": 39
			},
			"solo": {
				"header": 144,
				"note": 29
			},
			"record arm": {
				"header": 144,
				"note": 19
			}
		},
		"pad": {
			"header": 144,
			"range": {
				"x": [0, 8],
				"y": [0, 8]
			},
			"offset": {
				"x": 1,
				"y": 1
			}
		}
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
