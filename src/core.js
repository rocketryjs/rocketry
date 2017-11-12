/*
	Module dependencies
*/
// MIDI
const midi = require("midi");
// lodash
const _ = require("lodash");
// Supported devices
const support = require("./support.js");


const getButtonValue = function() {
	return;
};

const newInput = function() {
	return new midi.input();
};

const newOutput = function() {
	return new midi.output();
};


const getFirstLaunchpad = function(channel) {
	const numOfPorts = channel.getPortCount();
	for (let i = 0; i < numOfPorts; i++) {
		if (channel.getPortName(i).match(support.deviceRegex)) {
			return i;
		}
	}
};

const send = function(command, args, launchpad) {
	const config = support.devices[launchpad.device];
	const commandConfig = config.send[command] || command; // TODO: allow for arrays to be passed

	if (!commandConfig) {
		throw new Error("This command isn't available for your device or your config is missing your command.");
	}

	// Get message template from config
	// Flatten moves all the extra array's items in the main array and make sure `commandConfig` isn't overwiten
	let message = _.flattenDeep((function normalizeMessage(item) {
		switch (typeof item) {
			case "string":
				// Run as if it was a number (below) (no break) TODO: https://github.com/eslint/eslint/issues/9559
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
				throw new TypeError("This command has something interesting its message. `typeof` poked it with a stick and it concluded it wasn't a number or a string to be replaced with an argument.");
			}
		}
	}

	// Flatten again and check if all bytes are numbers
	message = _.flattenDeep(message);
	const allNumbers = message.every(function(value) {
		return typeof value === "number";
	});
	if (!allNumbers) {
		throw new Error("This command was called with a missing or invalid argument.");
	}

	// Send it already!
	// console.log(message); // debug
	launchpad.output.sendMessage(message);
};


const receive = function(launchpad) {
	launchpad.input.on("message", (deltaTime, message) => {
		launchpad.receive(deltaTime, message);
	});
};


const _core = {
	send,
	receive,
	getButtonValue,
	getFirstLaunchpad,
	newInput,
	newOutput
};


module.exports = _core;
