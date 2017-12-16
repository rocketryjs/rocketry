/*
	Module: Device base
	Description: The basic code all devices have in class form to be enxtended
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
// TODO
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

			// Config for possible events
			// this.events = this.getConfig("receive"); TODO

			// Set array for Buttons (which are emitters) that are listeneing to events
			if (!this.emitters) {
				this.emitters = [];
			}

			// Start receiving MIDI messages for this Launchpad and relay them to Buttons through receive()
			this.input.on("message", (deltaTime, message) => {
				console.log(message);
				// this.receive(deltaTime, message);
			});
		} catch (error) {
			throw new Error("Failed to open a MIDI port. Check your port and connection to your Launchpad.\n\n" + error);
		}

		// Method chaining
		return this;
	}

	close() {
		try {
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
		// Flatten array and check if all bytes are numbers
		message = _.flattenDeep(message);
		if (!message.every(value => (typeof value === "number"))) {
			throw new TypeError("The message to be sent to the device wasn't entirely numbers.");
		}

		// Send it via node-midi's output class instance associated with this device
		this.output.sendMessage(message);

		// Method chaining
		return this;
	}
	// Send arrays of System Exclusive MIDI bytes
	sendSysEx(message) {
		return this.send([...this.constructor.sysex.prefix, ...message, this.constructor.sysex.suffix]);
	}


	// Relay MIDI messages to listeners TODO
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
				// To buttons
				emitter.emit(event, ...arguments, args);
				// Update in case of .once() or .prependOnceListener()
				emitter.updateListeners();
			}
		}

		// To this device
		this.emit(event, ...arguments, args);
	}


	// Extend EventEmitter methods TODO meta
	addListener() {
		super.addListener(...arguments);

		// Method chaining
		return this;
	}
	on() {
		super.on(...arguments);

		// Method chaining
		return this;
	}
	once() {
		super.once(...arguments);

		// Method chaining
		return this;
	}
	prependListener() {
		super.prependListener(...arguments);

		// Method chaining
		return this;
	}
	prependOnceListener() {
		super.prependOnceListener(...arguments);

		// Method chaining
		return this;
	}
	removeListener() {
		super.removeListener(...arguments);

		// Method chaining
		return this;
	}
	removeAllListeners() {
		super.removeAllListeners(...arguments);

		// Method chaining
		return this;
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
