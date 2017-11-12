/*
	Module dependencies
*/
// lodash
const _ = require("lodash");


class Color {
	constructor(color) {
		if (typeof color === "string") {
			this.value = this.constructor.valueFromName(color);
		} else {
			this.value = color;
		}

		// Validate
		if (!this.validate()) {
			throw new Error("One or more of your color values aren't in the accepted range.");
		}
	}

	validate() {
		return (_.inRange(this.value, 0, 127));
	}
	// Override color names
	static set names(object) {
		this.userNames = object;
	}
	static valueFromName(name) {
		return (typeof this.userNames !== "undefined" && this.userNames[name]) || defaultColorNames[name]; // Use user color name object before defaults
	}
	static isColor(object) {
		return object instanceof this;
	}
}

Color.Rgb = class extends Color {
	constructor() {
		// Set colors from arguments
		let color = {};
		if (arguments.length === 3) {
			color.red = arguments[0];
			color.green = arguments[1];
			color.blue = arguments[2];
		} else if (Array.isArray(arguments[0])) {
			color.red = arguments[0][0];
			color.green = arguments[0][1];
			color.blue = arguments[0][2];
		} else if (typeof arguments[0] === "object") {
			color.red = arguments[0].red || arguments[0].r;
			color.green = arguments[0].green || arguments[0].g;
			color.blue = arguments[0].blue || arguments[0].b;
		} else {
			throw new Error("Your RGB color isn't a correctly formatted series of arguments, array, or object.");
		}

		// Call parent class's constructor
		super(color);
	}

	validate() {
		// One or more values in the array aren't in range
		this.value.every(function(value) {
			return _.inRange(value, 0, 63);
		});
		// for (const key in this.value) {
		// 	if (!_.inRange(this.value[key], 0, 63)) {
		// 		return false;
		// 	}
		// }
		// return true;
	}

	static isRgbColor(object) {
		return object instanceof this;
	}
};
