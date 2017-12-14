/*
	Module dependencies
*/
// lodash
const _ = require("lodash");
// Support
const support = require("./support.js");

/*
	888b     d888                                 888                 8888888b.                    d8b                                888
	8888b   d8888                                 888                 888  "Y88b                   Y8P                                888
	88888b.d88888                                 888                 888    888                                                      888
	888Y88888P888  .d88b.  888  888  .d88b.       888888 .d88b.       888    888  .d88b.  888  888 888  .d8888b .d88b.        .d8888b 888  8888b.  .d8888b  .d8888b
	888 Y888P 888 d88""88b 888  888 d8P  Y8b      888   d88""88b      888    888 d8P  Y8b 888  888 888 d88P"   d8P  Y8b      d88P"    888     "88b 88K      88K
	888  Y8P  888 888  888 Y88  88P 88888888      888   888  888      888    888 88888888 Y88  88P 888 888     88888888      888      888 .d888888 "Y8888b. "Y8888b.
	888   "   888 Y88..88P  Y8bd8P  Y8b.          Y88b. Y88..88P      888  .d88P Y8b.      Y8bd8P  888 Y88b.   Y8b.          Y88b.    888 888  888      X88      X88
	888       888  "Y88P"    Y88P    "Y8888        "Y888 "Y88P"       8888888P"   "Y8888    Y88P   888  "Y8888P "Y8888        "Y8888P 888 "Y888888  88888P'  88888P'
*/

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


module.exports = send;
