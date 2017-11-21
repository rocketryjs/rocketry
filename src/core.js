/*
	Module dependencies
*/
// MIDI (don't require with flag for CI testing)
const midi = process.argv.some(value => (value === "--no-midi")) ? undefined : require("midi");
// lodash
const _ = require("lodash");
// Supported devices
const support = require("./support.js");


// Gets a MIDI input
const newInput = function() {
	return new midi.input();
};
// Gets a MIDI output
const newOutput = function() {
	return new midi.output();
};

// Gets the first supported Launchpad's port
const getFirstLaunchpad = function(channel) {
	const numOfPorts = channel.getPortCount();
	for (let i = 0; i < numOfPorts; i++) {
		if (channel.getPortName(i).match(support.deviceRegex)) {
			return i;
		}
	}
};

// Send commands to a Launchpad instance
const send = function(command, args, launchpad) {
	const config = support.devices[launchpad.device];
	const commandConfig = config.send[command] || (Array.isArray(command) && command); // Get from config or use passed array

	if (!commandConfig) {
		throw new Error("This command isn't available for your device or your config is missing your command.");
	}

	// Get message template from config
	// Flatten moves all the extra array's items in the main array and make sure `commandConfig` isn't overwiten
	let message = _.flattenDeep((function normalizeMessage(item) {
		switch (typeof item) {
			case "string":
			// Run as if it was a number (below) (no break)
			case "number": {
				return [item];
			}
			case "object": {
				if (Array.isArray(item)) {
					return item;
				} else {
					// Do it again, but use the message property of the object
					if (item.message) {
						return normalizeMessage(item.message);
					} else {
						throw new Error("This command's object for your device doesn't have a message property.");
					}
				}
			}
			default: {
				throw new TypeError("This command's message for your device wasn't a number, array, or object.");
			}
		}
	})(commandConfig));

	// Add SysEx message prefix and suffix
	if (commandConfig.type === "sysex") {
		if (config.sysex) {
			// The message is now the original message but now with the prefix and suffix
			message = config.sysex.prefix ? config.sysex.prefix.concat(message) : message;
			message = config.sysex.suffix ? message.concat(config.sysex.suffix) : message;
		} else {
			throw new Error("This command is a SysEx call but the device didn't specify a SysEx object.");
		}
	}

	// Add arguments
	for (let i = 0; i < message.length; i++) {
		switch (typeof message[i]) {
			case "string": {
				// Replace the placeholder string with the argument it corresponds to
				message[i] = args[message[i]];
				break;
			}
			case "number": {
				break;
			}
			default: {
				throw new TypeError("This command had something that wasn't a number or a string to be replaced with an argument.");
			}
		}
	}

	// Flatten again and check if all bytes are numbers
	message = _.flattenDeep(message);
	const allNumbers = message.every(value => {
		return typeof value === "number";
	});
	if (!allNumbers) {
		throw new Error("This command was called with a missing or invalid argument.");
	}

	// Send it already!
	launchpad.output.sendMessage(message);

	// Return the Launchpad for send method chaining
	return launchpad;
};


const _core = {
	send,
	getFirstLaunchpad,
	newInput,
	newOutput
};


module.exports = _core;
