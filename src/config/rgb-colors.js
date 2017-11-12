/*
	Color Names

TODO
	If you're fooling around here trying to override these or add your own, you can do this without editing this file (yay!) in your implementation's file. Here's an example:

	// Make your object of colors
	const myColorNames = {
		"fabulous": 57, // one of the default colors for the MK2 and Pro (0-127), find these in the programmers reference guide from Novation (the actual colors look different and much nicer)
		"a cool rgb color": {
			"red": 10,
			"green": 20,
			"blue": 30
		} // You can use RGB colors too!
	};

	// Tell it to use your colors first and fallback to `defaultColorNames`
	rocket.Color.names = myColorNames;
*/

const data = {
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
		"grey": 71,
		"blue gray": 103,
		"blue grey": 103,
		"white": 3,
		"black": 0,
		"off": 0
	},
	"basic": {
		"range": [0, 127]
	},
	"rgb": {
		"range": [0, 63]
	}
};


module.exports = data;
