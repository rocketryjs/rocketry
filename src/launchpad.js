/*
	Module dependencies
*/
// lodash
const _ = require("lodash");
// Core
const _core = require("./core.js");
// Supported devices
const support = require("./support.js");


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

		// Set this instace as the last created one. This allows for users to ommit the instace in, say, Button creation while still allowing for it to be set.
		this.constructor.lastInstance = this;

		// Open connection with device
		this.open();

		// Method chaining
		return this;
	}

	open() {
		// Set device
		this.device = this._device; // Smart getter TODO

		// Open ports
		this.input.openPort(this.port.in);
		this.output.openPort(this.port.out);

		// Create object of listener arrays
		// Start receiving for this Launchpad
		this.events = Object.keys(this.getConfig("receive"));
		_core.receive(this);

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

	receive(deltaTime, message) {
		// TODO relay message to Buttons
		// const value = message[1]; TODO use config
	}

	get _device() {
		const portName = this.input.getPortName(this.port.in);
		const match = portName.match(support.deviceRegex);
		if (match) {
			// Smart getter TODO (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#Smart_self-overwriting_lazy_getters)
			// delete this.device;
			// return this.device = match[1];
			return match[1];
		} else {
			throw new Error(`The port name (${portName}) for your Launchpad doesn't match the supported devices. Report this to the developer if you believe this was an error`);
		}
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

	normalizeColor(...args) {
		// Validate and normalize colors for use in commands
		args = _.flattenDeep(args);
		let color;
		let valid;

		// Named basic or RGB color
		if (typeof args[0] === "string" && args.length === 1) {
			color = (typeof this.colors !== "undefined" && this.colors[args[0]]) || this.getConfig(`colors.names.${args[0]}`);
			return this.normalizeColor(color);
		}

		// Values
		if (args.length === 3 || typeof args[0] === "object") {
			// RGB: (red, green, blue) or ([red, green, blue]) or {r, g, b} or {red, green, blue}
			color = [];
			color[0] = args[0].red || args[0].r || args[0];
			color[1] = args[0].green || args[0].g || args[1];
			color[2] = args[0].blue || args[0].b || args[2];

			const range = this.getConfig("colors.rgb.range");
			valid = color.every(function(value) {
				return _.inRange(value, ...range);
			}, this);
		} else {
			// Basic: user color name or defaults color name for the device or use number
			color = args[0];

			const range = this.getConfig("colors.basic.range");
			valid = _.inRange(color, ...range);
		}

		// Exit
		if (!valid) {
			throw new Error("One or more of your color values aren't in the accepted range.");
		}
		return color;
	}

	lightAll(color) {
		// TODO
		if (Array.isArray(color)) {
			// RGB
			throw new TypeError("Light all can't be used with an RGB color via MIDI.");
		} else if (typeof color === "number") {
			// Basic
		}

		// Method chaining
		return this;
	}
	darkAll() {
		// TODO
		// Method chaining
		return this;
	}
	changeLayout(layout) {
		// TODO
		// Method chaining
		return this;
	}
	textScroll(color, loop, text) {
		// TODO
		if (Array.isArray(color)) {
			// RGB
			throw new TypeError("Text scrolling can't be used with an RGB color via MIDI.");
		} else if (typeof color === "number") {
			// Basic
		}

		// Method chaining
		return this;
	}

	static isLaunchpad(object) {
		return object instanceof this;
	}
}


module.exports = Launchpad;
