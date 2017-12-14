/*
	Module: RGB color
	Description: Color names and ranges for RGB capapble Launchpad devices

	Note: You can change these values at runtime. Read about how to do this on the GitHub wiki.
*/


module.exports = {
	"names": {
		"red": 5,
		"pink": 95,
		"fuchsia": 58,
		"purple": 55,
		"deep purple": 81,
		"indigo": 50,
		"blue": 45,
		"light blue": 41,
		"cyan": 37,
		"teal": 65,
		"green": 23,
		"light green": 21,
		"lime": 17,
		"yellow": 62,
		"amber": 61,
		"orange": 9,
		"deep orange": 11,
		"brown": 83,
		"sepia": 105,
		"gray": 71,
		"grey": "gray",
		"blue gray": 103,
		"blue grey": "blue gray",
		"white": 3,
		"black": "off",
		"off": 0
	},
	"basic": {
		"range": [0, 128] // Range, exclusive on ceiling
	},
	"rgb": {
		"range": [0, 64] // Range, exclusive on ceiling
	}
};
