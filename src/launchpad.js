/*
	Module dependencies
*/
// lodash
const _ = require("lodash");
// Core
const _core = require("./core.js");
// Supported devices
const support = require("./support.js");

/*
	Functions
*/
const hasSimilarBytes = function(message, template) {
	for (let i = 0; i < template.length; i++) {
		if (typeof template[i] === "string") {
			continue;
		}

		if (message[i] === template[i]) {
			continue;
		} else {
			return false;
		}
	}

	return true;
};


/*
	Launchpad Class
*/
class Launchpad {
	constructor(...ports) {
		// Create MIDI I/O
		this.input = _core.newInput();
		this.output = _core.newOutput();
		this.port = {};

		if (ports.length === 2 && typeof ports[0] === "number" && typeof ports[1] === "number") {
			this.port.in = ports[0];
			this.port.out = ports[1];
		} else {
			const port = ports[0];

			switch (typeof port) {
				case "number": {
					this.port.in, this.port.out = port;
					break;
				}
				case "object": {
					if (Array.isArray(port)) {
						this.port.in = port[0];
						this.port.out = port[1];
					} else {
						this.port = port;
					}
					break;
				}
				case "undefined": {
					// Find first device in MIDI out and MIDI in with a correct name
					this.port.in = _core.getFirstLaunchpad(this.input);
					this.port.out = _core.getFirstLaunchpad(this.output);
					break;
				}
				default: {
					throw new TypeError("Invalid port type.");
				}
			}
		}

		// Set this instace as the last created one. This allows for users to ommit the instace in, Button, Column, and Row creation while still allowing for it to be set.
		this.constructor.lastInstance = this;

		// Open connection with device
		this.open();

		// Method chaining
		return this;
	}

	open() {
		try {
			// Set device
			this.device = (() => {
				// Get port names
				const inPortName = this.input.getPortName(this.port.in).match(support.deviceRegex);
				const outPortName = this.output.getPortName(this.port.out).match(support.deviceRegex);

				if ((inPortName && outPortName) && inPortName[1] === outPortName[1]) {
					return inPortName[1];
				} else {
					throw new Error("A port name for your Launchpad doesn't match the supported devices or doesn't match the other port.");
				}
			})();

			// Open ports
			this.input.openPort(this.port.in);
			this.output.openPort(this.port.out);

			// Config for possible events
			this.events = this.getConfig("receive");
			// Set array for Buttons (which are emitters) that are listeneing to events
			this.emitters = [];
			// Start receiving MIDI messages for this Launchpad and relay them to Buttons through receive()
			this.input.on("message", (deltaTime, message) => {
				this.receive(deltaTime, message);
			});
		} catch (error) {
			throw new Error("Failed to open a MIDI port. Check your port and connection to your Launchpad.\n\n" + error);
		}

		// Method chaining
		return this;
	}
	close() {
		// Close ports
		this.input.closePort();
		this.output.closePort();

		// Method chaining
		return this;
	}

	// Relay MIDI messages to listeners
	receive(deltaTime, message) {
		// Get arguments and event from config template and message
		let event;
		const args = {};
		for (const key in this.events) {
			const template = this.events[key];
			if (hasSimilarBytes(message, template)) {
				event = key;
				for (let i = 0; i < template.length; i++) {
					if (typeof template[i] === "string") {
						args[template[i]] = message[i];
					}
				}
				break;
			}
		}

		// Relay to listeners
		for (const emitter of this.emitters) {
			let isSimilarEmitter;
			for (const value of emitter.values) {
				if (_.isEqual(value, args)) {
					isSimilarEmitter = true;
					break;
				}

				isSimilarEmitter = false;
			}

			if (isSimilarEmitter) {
				emitter.emit(event, ...arguments, args);
				// Update in case of .once() or .prependOnceListener()
				emitter.updateListeners();
			}
		}

		// Method chaining
		return this;
	}

	getConfig(...paths) {
		// Find all values in the launchpad's config using the argument's strings as paths to the property
		const config = _.at(support.devices[this.device], ...paths);

		if (paths.length === 1) {
			return config[0];
		} else {
			return config;
		}
	}
	hasConfig(...paths) {
		// If any config properties are undefined, return false
		const values = this.getConfig(...paths);
		if (Array.isArray(values)) {
			return values.length === _.without(values, undefined).length;
		} else {
			return !!values;
		}
	}

	// Interaction
	// Color
	setColor(color) {
		color = this.normalizeColor(color);

		if (Array.isArray(color)) {
			// RGB
			throw new TypeError("Light all can't be used with an RGB color via MIDI.");
		} else if (typeof color === "number") {
			// Basic
			_core.send("light all", {color}, this);
		}

		// Method chaining
		return this;
	}
	// Aliases for setColor
	set color(color) {
		this.setColor(color);
	}
	light(color) {
		return this.setColor(color);
	}
	lightAll(color) {
		return this.setColor(color);
	}
	dark() {
		return this.setColor("off");
	}
	darkAll() {
		return this.setColor("off");
	}
	// Text Scrolling
	scrollText(color, text, loop = 0) {
		color = this.normalizeColor(color);
		if (text) {
			text = this.normalizeText(text);
		} else {
			text = 0;
		}
		loop = +loop; // true, 1 => 1; false, 0, "" => 0

		if (Array.isArray(color)) {
			// RGB
			throw new TypeError("Text scrolling can't be used with an RGB color via MIDI.");
		} else if (typeof color === "number") {
			// Basic
			_core.send("scroll text", {color, loop, text}, this);
		}

		// Method chaining
		return this;
	}
	// Scroll stopping
	stopScrollText() {
		return this.scrollText(0);
	}

	// Normalization of arguments for MIDI
	// Validates colors, finds colors from their names, and normalizes formats from many into a single one for each RGB and standard colors for internal use.
	normalizeColor(color) {
		const config = this.getConfig("colors");
		// Validate and normalize colors for use in commands
		let result;
		let valid;

		// Named basic or RGB color
		if (typeof color === "string") {
			// From user's color names first, then fallback on default
			result = (typeof this.colors !== "undefined" && this.colors[color]) || config.names[color];
			return this.normalizeColor(result);
		}

		// Values
		if (typeof color === "object") {
			// RGB: {red, green, blue} or {r, g, b} or [red, green, blue]
			result = [];
			result[0] = color.red || color.r || color[0];
			result[1] = color.green || color.g || color[1];
			result[2] = color.blue || color.b || color[2];

			const range = config.rgb.range;
			valid = result.every(value => {
				return _.inRange(value, ...range);
			}, this);
		} else {
			// Basic: user color name or defaults color name for the device or use number
			result = color;

			const range = config.basic.range;
			valid = _.inRange(result, ...range);
		}

		// Exit
		if (!valid) {
			throw new RangeError("One or more of your color values aren't in the accepted range.");
		}
		return result;
	}
	normalizeText(text) {
		let result = [];
		if (Array.isArray(text)) {
			for (const object of text) {
				if (typeof object === "string") {
					// Recursive with each string
					result.push(this.normalizeText(object));
				} else {
					// Add plain speed byte, recursive with each string in object
					result.push(object.speed);
					result.push(this.normalizeText(object.text));
				}
			}
		} else {
			// Get character codes, not all ASCII works; not all non-standard ASCII fails so there's not currently a validation process
			for (let i = 0; i < text.length; i++) {
				result.push(text.charCodeAt(i));
			}
		}
		return result;
	}

	static isLaunchpad(object) {
		return object instanceof this;
	}
}


module.exports = Launchpad;
