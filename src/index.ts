/*
	Module: Index - Rocketry
	Description: Assembly of the individual modules, methods for constructing devices
*/
import _ from "lodash";

export const init = (options: {plugins: Array<any>}) => {

};
const rocketry = {init};
export default rocketry;







const constructor = function(...portNums) {
	// Get MIDI IO
	const {input, output} = this.constructor.createMidiIO();

	// Normalize ports
	portNums = this.constructor.normalizePorts(portNums);

	// Get the next supported deivce if no ports were provided
	if (!portNums) {
		const nextDevice = this.constructor.getNextDevice(input, output);
		if (nextDevice) {
			portNums = nextDevice;
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
			return {
				// Gets a MIDI input
				"input": new midi.input(),
				// Gets a MIDI output
				"output": new midi.output()
			};
		} catch (error) {
			throw new Error("Couldn't create MIDI I/O.\n\n" + error);
		}
	},


	// Find next device that's not already open
	getNextDevice(inputPort, outputPort) {
		const devices = this.getDevice(inputPort, outputPort);
		for (const device of devices) {
			// Use this device if not already opened
			let isOpened;
			for (const value of this.opened.values()) {
				if (_.isMatch(value, device)) {
					isOpened = true;
				}
			}
			// console.log(isOpened)
			if (!isOpened) {
				return device;
			}
		}

		return false;
	},


	// Generator for getting devices
	* getDevice(inputPort, outputPort) {
		// Generate input port numbers
		const inputPortNums = this.getPort(inputPort);
		// Generate output port numbers
		const outputPortNums = this.getPort(outputPort);

		// While not out of either, make pairs for devices
		while (true) {
			const input = inputPortNums.next();
			const output = outputPortNums.next();

			if (input.done || output.done) {
				return;
			} else {
				yield {
					"input": input.value,
					"output": output.value
				};
			}
		}
	},
	// Gets the ports that match the supported regex
	* getPort(port) {
		const portCount = port.getPortCount();

		// For all ports in input/output
		for (let i = 0; i < portCount; i++) {
			if (this.getPortName(port, i).match(this.regex)) {
				yield i;
			}
		}
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
	Rocketry - All together now!
*/
const rocketry = Object.assign(
	constructor,
	methods,
	{
		"devices": {},
		"opened": new Map()
	}
);


/*
	Properties - regex getter
*/
Object.defineProperty(rocketry, "regex", {
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
	Export Rocketry
*/
export default rocketry;


/*
	Devices
*/
const LaunchpadMk2 = require("./launchpad/launchpad-mk2.js");
rocketry.devices[LaunchpadMk2.type] = LaunchpadMk2;
