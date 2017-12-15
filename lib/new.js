/*
	Module: New
	Description: Constructor that returns the correct device class after creating IO
*/
/*
	Module dependencies
*/
// Core
const core = require("./core.js");
// Support
const {devices, support} = require("./support.js");


module.exports = function(...portNums) {
	let input, output, name;

	// Get MIDI IO
	({input, output} = core.createMidiIO());
	// Normalize ports
	portNums = core.normalizePorts(portNums);
	// Get the first supported deivce is no ports were provided
	try {
		if (!portNums) {
			// Find first device in MIDI out and MIDI in with a correct name
			portNums = core.getFirstSupportedDevice(input, output);
		}
	} catch (error) {
		throw new Error("Failed to find a supported device. Check your port and connection to your device.\n\n" + error);
	}
	// Get device's port names
	name = core.getDeviceName(input, output, portNums.input, portNums.output);

	// Gets the key in `devices` for the device `name`
	const deviceTypeKey = support.getMatchingKey(name);
	// Gets the class for said key
	const DeviceType = devices[deviceTypeKey];
	// Return the constructed instance of the device class (which will open a connection)
	return new DeviceType(input, output, portNums);
};
