/*
	Module: Index - Rocket
	Description: Assembly of the individual modules, methods for constructing devices
*/
/*
	Module dependencies
*/
const midi = require("midi");


const constructor = function(...portNums) {
	// Get MIDI IO
	const {input, output} = this.constructor.createMidiIO();
	// Normalize ports
	portNums = this.constructor.normalizePorts(portNums);
	// Get the first supported deivce if no ports were provided
	if (!portNums) {
		// Find first device in MIDI out and MIDI in with a correct name
		const firstDevice = this.constructor.getFirstSupportedDevice(input, output);
		if (firstDevice) {
			portNums = firstDevice;
		} else {
			throw new Error("Failed to find a supported device. Check your port and connection to your device.");
		}
	}
	// Get device's port names
	const name = this.constructor.getDeviceName(input, output, portNums.input, portNums.output);

	// Gets the key in `devices` for the device type name
	const deviceTypeKey = this.constructor.getMatchingKey(name);
	// Gets the class for said key
	const DeviceType = this.constructor.devices[deviceTypeKey];
	// Return the constructed instance of the device class (which will open a connection)
	return new DeviceType(input, output, portNums);
};


const devices = {};


/*
	Basic features to find and use MIDI devices
*/
const methods = {
	// Normalize ports
	normalizePorts(ports) {
		if (ports.length === 2 && ports.every(value => (typeof value === "number"))) {
			return {
				"input": ports[0],
				"output": ports[1]
			};
		} else {
			const first = ports[0];

			switch (typeof first) {
				case "number": {
					return {
						"input": first,
						"output": first
					};
				}
				case "object": {
					if (Array.isArray(first) && first.every(value => (typeof value === "number"))) {
						return {
							"input": first[0],
							"output": first[1]
						};
					} else if (typeof first.input === "number" && typeof first.output === "number") {
						// first ~= {input, output}
						return first;
					} else {
						throw new TypeError("Invalid port type in array or object of ports.");
					}
				}
				case "undefined": {
					return false;
				}
				default: {
					throw new TypeError("Invalid port type.");
				}
			}
		}
	},


	// Get MIDI I/O
	createMidiIO() {
		try {
			const data = {};
			// Gets a MIDI input
			data.input = new midi.input();
			// Gets a MIDI output
			data.output = new midi.output();

			return data;
		} catch (error) {
			throw new Error("Couldn't create MIDI I/O.\n\n" + error);
		}
	},


	// Gets the first port that match the given pattern
	getFirstMatchingPort(port, pattern) {
		const names = this.getAllPortNames(port);

		// For all ports in input/output
		for (let i = 0; i < names.length; i++) {
			if (names[i].match(pattern)) {
				return i;
			}
		}

		return false;
	},
	// Gets the first device with ports that match the given pattern
	getFirstMatchingDevicePorts(inputPort, outputPort, pattern) {
		// Get the first input port that matches the pattern (regex or otherwise)
		const input = this.getFirstMatchingPort(inputPort, pattern);
		// Get the first output port that matches the input port string
		const output = this.getFirstMatchingPort(outputPort, this.getPortName(inputPort, input));

		return typeof input === "number" && typeof output === "number" ? {input, output} : false;
	},
	// Gets the first supported device's ports
	getFirstSupportedDevice(inputPort, outputPort) {
		const device = this.getFirstMatchingDevicePorts(inputPort, outputPort, this.regex);
		return device ? device : false;
	},


	// Alias for port.getPortCount
	getPortCount(port) {
		return port.getPortCount();
	},


	// Get a port's name
	getPortName(port, num) {
		// Get name from node-midi
		const name = port.getPortName(num);
		// Return the port name with the port number at the end removed
		if (name) {
			return name.match(/(.+)(?:\s+\d*)$/i)[1];
		} else {
			throw new Error("There's no device at the port number " + num);
		}
	},
	// Get all existing port names
	getAllPortNames(port) {
		const portCount = this.getPortCount(port);
		const names = [];

		for (let i = 0; i < portCount; i++) {
			names.push(this.getPortName(port, i));
		}

		return names;
	},
	// Get a device name based off a device's port names
	getDeviceName(inputPort, outputPort, inputNum, outputNum) {
		let name;
		const inputName = this.getPortName(inputPort, inputNum);
		const outputName = this.getPortName(outputPort, outputNum);

		// If the input's name and output matches (setting name to the input's)
		if ((name = inputName) === outputName) {
			return name;
		} else {
			throw new Error(`Your device's output port's name doesn't match your input port's name (${name}).`);
		}
	},


	// Run the regex for the supported devices, getting the first capture group
	/*
		Example:
			From: "3- Launchpad MK2" (not a key in `devices`, from port names)
			To: "Launchpad MK2" (is a key, from the device's class's regex getter's first capture group)
	*/
	getMatchingKey(name) {
		const match = name.match(this.regex);

		if (match) {
			// Return either the first capture group in the match (in case of regex) or the match (in case of string or regex without a first capture group)
			return match[1] || match;
		} else {
			throw new Error(`Your device, ${name}, is not supported.`);
		}
	}
};


/*
	Rocket - All together now!
*/
const rocket = Object.assign(
	constructor,
	methods,
	{
		devices
	}
);


/*
	Properties - regex getter
*/
Object.defineProperty(rocket, "regex", {
	get() {
		// Get all type names, or regex strings that get a type
		const types = [];
		for (const key in this.devices) {
			if (this.devices[key].regex) {
				types.push(this.devices[key].regex);
			} else {
				types.push(this.devices[key].type);
			}
		}

		// Generate and return regex from above
		return new RegExp(`^(?:${types.join(")|(?:")})$`, "i");
	}
});


/*
	Export Rocket
*/
module.exports = rocket;


/*
	Devices
*/
const LaunchpadMk2 = require("./launchpad/launchpad-mk2.js");
rocket.devices[LaunchpadMk2.type] = LaunchpadMk2;
