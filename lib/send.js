/*
	Module: Send
	Description: Methods to send arrays of MIDI bytes
*/
/*
	Module dependencies
*/
const _ = require("lodash");


const addStatusByte = function(message, start, channel) {
	// Throw error if not between 1 and 16 (inclusive, 17 using lodash's exclusive range)
	if (!_.inRange(channel, 1, 17)) {
		throw new RangeError(`The MIDI channel ${channel}, is not between 1 and 16 (inclusive).`);
	}

	// Channel 1's first byte: start value ... Channel 16's: start value + 15
	const statusByte = (channel - 1) + start;
	// Prepend to front (mutate)
	message.unshift(statusByte);
	// Return message array
	return message;
};


/*
	Send arrays of MIDI bytes
*/
const send = function(message) {
	// Flatten array - allows me to skip concatenation
	message = _.flattenDeep(message);
	// Check if all bytes are numbers and in range
	if (!message.every(value => (_.inRange(value, 0, 256)))) {
		throw new RangeError("The message to be sent to the device contained a byte that was out of range.");
	}

	// Send it via node-midi's output class instance associated with this device
	try {
		this.output.sendMessage(message);
	} catch (error) {
		throw new Error(`Failed to send ${message} via MIDI.\n\n${error}`);
	}

	// Method chaining
	return this;
};
// Send arrays of MIDI bytes with status bytes
// Message: array of MIDI bytes
// Channel: 1 (default) to 16
send.noteoff = function(message, channel = 1) {
	// Prepend status byte with channel (128 - 143)
	addStatusByte(message, 128, channel);
	return this.send(message);
};
send.noteon = function(message, channel = 1) {
	// Prepend status byte with channel (144 - 159)
	addStatusByte(message, 144, channel);
	return this.send(message);
};
send.polykeypressure = function(message, channel = 1) {
	// Prepend status byte with channel (160 - 175)
	addStatusByte(message, 160, channel);
	return this.send(message);
};
send.controlchange = function(message, channel = 1) {
	// Prepend status byte with channel (176 - 191)
	addStatusByte(message, 176, channel);
	return this.send(message);
};
send.programchange = function(message, channel = 1) {
	// Prepend status byte with channel (192 - 207)
	addStatusByte(message, 192, channel);
	return this.send(message);
};
send.monokeypressure = function(message, channel = 1) {
	// Prepend status byte with channel (208 - 223)
	addStatusByte(message, 208, channel);
	return this.send(message);
};
send.channelpressure = send.monokeypressure;
send.pitchbend = function(message, channel = 1) {
	// Prepend status byte with channel (224 - 239)
	addStatusByte(message, 224, channel);
	return this.send(message);
};
send.systemexclusive = function(message) {
	// Send message (status byte, IDs, message, EOX)
	return this.send([240, message, 247]);
};
send.sysex = send.systemexclusive;


module.exports = send;
