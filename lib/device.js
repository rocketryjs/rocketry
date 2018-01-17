/*
	Module: Device base
	Description: The basic code all devices have in class form to be extended
*/
/*
	Module dependencies
*/
// Node events
const EventEmitter = require("events");
// lodash
const _ = require("lodash");
// Core
const core = require("./core.js");


/*
	Functions
*/
const doesByteMatch = function(byte, capture, state) {
	// Validity
	// If the function exists, execute it. Fallback on true.
	const isValid = typeof state.validate === "function" ? state.validate(byte, capture) : true;
	// Matching
	// If array exists, match against next item in it. Fallback on true.
	const doesMatch = Array.isArray(state.matches) ? state.matches[capture.length] === byte : true;

	return isValid && doesMatch;
};
const matchBytes = function(bytes, states) {
	// Where the captures will be stored
	const captures = {};

	let stateIndex = 0; // move?

	// Loop over the messages as the "input" while matching against the current state
	for (let byteIndex = 0; byteIndex < bytes.length;) {
		const stateKey = Object.keys(states)[stateIndex];
		const state = states[stateKey];
		const nextStateKey = Object.keys(states)[stateIndex + 1];
		const nextState = states[nextStateKey];
		const byte = bytes[byteIndex];

		// Return if no more states and it's still matching
		if (!state) {
			return false;
		}

		// Capture array to push into
		let capture = captures[stateKey];
		if (!capture) {
			// If it isn't already capturing, start doing so by creating a new array
			capture = captures[stateKey] = [];
		}

		// Would the next state will match the current byte with a new capture group?
		const willNextMatch = nextState && doesByteMatch(byte, [], nextState);
		// Does the capture have at least the minimum captures required?
		const hasEnoughCaptures = (typeof state.min === "number" && capture.length >= state.min) || (state.matches && capture.length >= state.matches.length);
		// Does the capture have at least the maximum captures required?
		const hasAllCaptures = (typeof state.max === "number" && capture.length >= state.max) || (state.matches && capture.length >= state.matches.length);

		// If (the next state could match it and the capture has enough) or (the capture is full), stop capturing and retry
		if ((willNextMatch && hasEnoughCaptures) || (hasAllCaptures)) {
			// Next state
			stateIndex++;
			// Don't increase the byteIndex and continue to retry with the same byte
			continue;
		}

		if (doesByteMatch(byte, capture, state)) {
			// Capture this byte
			capture.push(byte);
			// Next byte
			byteIndex++;
			// Don't increase the stateIndex and continue with the same state
		} else {
			return false;
		}
	}

	// Loop over the rest of the states to determine if it had to match more than in the input
	for (stateIndex++; stateIndex < Object.keys(states).length; stateIndex++) {
		const stateKey = Object.keys(states)[stateIndex];
		const state = states[stateKey];

		const canSkip = (typeof state.min === "number" && 0 >= state.min) || (state.matches && 0 >= state.matches.length);
		if (canSkip) {
			// Empty capture array
			captures[stateKey] = [];
		} else {
			// Missing a value that wasn't optional
			return false;
		}
	}

	// Mutate the match
	for (const key in states) {
		const mutate = states[key].mutate;

		if (typeof mutate === "function") {
			mutate.call(this, captures);
		}
	}

	// If it didn't return false before this, it must've matched. You deserve to know the captures
	return captures;
};


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
	Device class
*/
class Device extends EventEmitter {
	constructor(input, output, portNums) {
		// EventEmitter
		super();

		// Properties
		if (!input || !output || !portNums) {
			throw new Error("Missing argument when creating a new device.");
		}
		this.input = input;
		this.output = output;
		this.portNums = portNums;

		// Open connection with device
		this.open();
	}


	open() {
		// Create MIDI I/O when re-opening after closing
		if (!this.input || !this.output) {
			Object.assign(this, core.createMidiIO());
		}

		try {
			// Open ports
			this.input.openPort(this.portNums.input);
			this.output.openPort(this.portNums.output);


			// Set array for Buttons (which are emitters) that are listeneing to events
			if (!this.emitters) {
				this.emitters = [];
			}

			// Receiving
			// Allow responses of SysEx and MIDI beat clock messages
			this.input.ignoreTypes(false, false, false);
			// Start receiving MIDI messages for this Launchpad and relay them to Buttons through receive()
			this.input.on("message", (deltaTime, message) => {
				// console.log("debug receive:", message); // TODO debug
				this.receive(deltaTime, message);
			});

			// Notify device open
			this.emit("open");
		} catch (error) {
			throw new Error("Failed to open a MIDI port. Check your port and connection to your Launchpad.\n\n" + error);
		}

		// Method chaining
		return this;
	}

	close() {
		try {
			// Notify closure
			this.emit("close");

			// Close ports
			this.input.closePort();
			this.output.closePort();

			// Delete ports so new ones can be created in its place if reopened
			delete this.input;
			delete this.output;
		} catch (error) {
			throw new Error("Couldn't close MIDI I/O.\n\n" + error);
		}

		// Method chaining
		return this;
	}


	// Send arrays of MIDI bytes
	send(message) {
		// Flatten array and check if all bytes are numbers and in range
		message = _.flattenDeep(message);
		if (!message.every(value => (_.inRange(value, 0, 256)))) {
			throw new RangeError("The message to be sent to the device contained a byte that was out of range.");
		}

		// Send it via node-midi's output class instance associated with this device
		try {
			this.output.sendMessage(message);
		} catch (error) {
			throw new Error(`Failed to send ${message} via MIDI.\n\n${error}`);
		}
		// console.log("debug send:", message); // TODO debug

		// Method chaining
		return this;
	}
	// Send arrays of MIDI bytes with status bytes
	// Message: array of MIDI bytes
	// Channel: 1 (default) to 16
	sendNoteOff(message, channel = 1) {
		// Prepend status byte with channel (128 - 143)
		addStatusByte(message, 128, channel);
		return this.send(message);
	}
	sendNoteOn(message, channel = 1) {
		// Prepend status byte with channel (144 - 159)
		addStatusByte(message, 144, channel);
		return this.send(message);
	}
	sendPolyKeyPressure(message, channel = 1) {
		// Prepend status byte with channel (160 - 175)
		addStatusByte(message, 160, channel);
		return this.send(message);
	}
	sendControlChange(message, channel = 1) {
		// Prepend status byte with channel (176 - 191)
		addStatusByte(message, 176, channel);
		return this.send(message);
	}
	sendProgramCange(message, channel = 1) {
		// Prepend status byte with channel (192 - 207)
		addStatusByte(message, 192, channel);
		return this.send(message);
	}
	sendMonoKeyPressure(message, channel = 1) {
		// Prepend status byte with channel (208 - 223)
		addStatusByte(message, 208, channel);
		return this.send(message);
	}
	sendChannelPressure() {
		// Mono Key pressure alias
		return this.sendMonoKeyPressure(...arguments);
	}
	sendPitchBend(message, channel = 1) {
		// Prepend status byte with channel (224 - 239)
		addStatusByte(message, 224, channel);
		return this.send(message);
	}
	// Send arrays of System Exclusive MIDI bytes
	sendSysEx(
		// Array of message bytes
		message,
		// ID for the device manufacturer from the MIDI Manufacturers Association
		manufacturerId = this.constructor.sysExManufacturerId || [],
		// ID for the model from the manufacturer
		modelId = this.constructor.sysExModelId || []
	) {
		// Structure message (status byte, IDs, message, EOX)
		message = [240, ...manufacturerId, ...modelId, ...message, 247];
		// Send
		return this.send(message);
	}
	// Send System Common (Universal System "Exclusive") MIDI bytes
	sendSysCom(message) {
		// Structure message (status byte, message, EOX)
		message = [240, ...message, 247];
		// Send
		return this.send(message);
	}


	// Relay MIDI messages to listeners
	receive(deltaTime, message) {
		let event;
		let captures;

		// Get capture groups and matching event from events object and message
		for (const key in this.constructor.events) {
			captures = matchBytes.call(this, message, this.constructor.events[key]);
			if (captures) {
				// It matches, use this event
				event = key;

				// Assign the matching capture groups
				Object.assign(message, captures);
				break;
			}
		}

		// Relay to listeners by emitting to all listed emitters
		for (const emitter of this.emitters) {
			if (emitter.willEmit(event, message, deltaTime)) {
				// To buttons
				emitter.emit(event, message, deltaTime);
				// Update in case of .once() or .prependOnceListener()
				emitter.updateListeners();
			}
		}

		// To this device
		this.emit("message", message, deltaTime);
		this.emit(event, message, deltaTime);
	}


	// Return a promise that resolves for an event
	promiseOnce(
		// Event to listen for
		event = "message",
		// Timeout in ms
		timeout = 1000
	) {
		return new Promise((resolve, reject) => {
			// Hoist timeout
			let timeoutObj;

			// Listen for event
			const listener = (message) => {
				// Clear timeout
				clearTimeout(timeoutObj);
				// Resolve message args
				resolve(message);
			};
			this.prependOnceListener(event, listener);

			// Timeout if not a falsy value
			if (timeout) {
				timeoutObj = setTimeout(() => {
					// If still listening
					if (this.listeners(event).includes(listener)) {
						// Remove the listener and reject the promise
						this.removeListener(event, listener);
						reject();
					}
				}, timeout);
			}
		});
	}


	// this.toString => [object Launchpad MK2]
	// or [object Device] (if for some reason it doesn't have a name)
	get [Symbol.toStringTag]() {
		return this.constructor.name ? this.constructor.name : "Device";
	}


	static is(object) {
		return object instanceof this;
	}
}


module.exports = Device;
