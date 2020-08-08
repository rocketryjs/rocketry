/*
	Module: Device base
	Description: The basic code all devices have in class form to be extended
*/
import {EventEmitter} from "events";
import bindDeep from "bind-deep";
import rocketry, {send, PortNumbers} from ".";
import {MIDILayerAPI, SendType, DeviceAPI} from "./types";


/*
	Functions
*/
const doesByteMatch = function(byte: number, capture, state) {
	// Validity
	// If the function exists, execute it. Fallback on true.
	const isValid = typeof state.validate === "function" ? state.validate.call(this, byte, capture) : true;
	// Matching
	// If array exists, match against next item in it. Fallback on true.
	const doesMatch = Array.isArray(state.matches) ? state.matches[capture.length] === byte : true;

	return isValid && doesMatch;
};
const matchBytes = function(bytes: Array<number>, states) {
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
		const willNextMatch = nextState && doesByteMatch.call(this, byte, [], nextState);
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

		if (doesByteMatch.call(this, byte, capture, state)) {
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


/*
	Device class
*/
export interface Device {
	// Constructor ain't just a function, it also is the base class and the device API
	constructor: typeof Device & DeviceAPI;
}
export abstract class Device extends EventEmitter {
	midi: MIDILayerAPI;
	send: SendType<Device>;
	private static _inits;
	private static _events;

	constructor (portNums: PortNumbers) {
		// EventEmitter
		super();

		if (!rocketry.midi) {
			throw new Error("No MIDI layer initialized.");
		}

		this.midi = new rocketry.midi();

		// Properties
		if (!portNums) {
			const {input, output} = this.midi.getAllPortNumbers(this.constructor.regex);
			if (input.length && output.length) {
				portNums = {
					input: input[0].number,
					output: output[0].number,
				};
			} else {
				throw new Error("No supported device found, try supplying port numbers when creating the device.");
			}
		}

		this.send = bindDeep(send, this);

		// Call the initializers defined on the subclass (e.x. from mixins)
		this.constructor.inits.forEach(init => init.call(this));

		// Open connection with device
		this.open(portNums);
	}

	// Set array for Buttons (which are emitters) that are listeneing to events
	emitters = [];
	open (portNums: PortNumbers) {
		this.midi.connect(portNums);

		// Notify that the device is open
		this.emit("open");

		// Method chaining
		return this;
	}

	close() {
		// Notify closure
		this.emit("close");

		this.midi.disconnect();

		// Method chaining
		return this;
	}

	// Relay MIDI messages to listeners
	receive(deltaTime: number, message: Array<number>) {
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
			let timeoutObj: NodeJS.Timeout;

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


	/*
		Get the initializers defined on the subclass (e.g. from mixins)

		- Is used to run code from mixins when a new instance of any subclass of `Device` is created
			- Esentially extending the `constructor()`
		- Intentionally doesn't impelement a method for inheritance
			- Would be too complicated of an API to traverse the prototype for what would disincentivize properly using mixins
			- May change in the future as device support grows
	*/
	static get inits() {
		// Throw if called on raw `Device` class
		// - Is to prevent mixins for subclasses from accidentally polluting the parent class
		// - May be dropped if there's a need for inits in plugins
		if (this === Device) {
			throw Error("You cannot get the initializers of the Device parent class.");
		}

		// If the subclass doesn't have its own `_inits`
		if (!Object.prototype.hasOwnProperty.call(this, "_inits")) {
			// Make an init `Set` on the subclass
			Object.defineProperty(this, "_inits", {
				value: new Set(),
			});
		}

		// Return the inits
		return this._inits;
	}

	/*
		Get the events defined on the subclass (e.x. from mixins)

		- Is used to add event datatypes from mixins
		- Intentionally doesn't impelement a method for inheritance
			- Would be too complicated of an API to traverse the prototype for what would disincentivize properly using mixins
			- May change in the future as device support grows
	*/
	static get events() {
		// Throw if called on raw `Device` class
		// - Is to prevent mixins for subclasses from accidentally polluting the parent class
		// - May be dropped if there's a need for `Device`-level events
		if (this === Device) {
			throw Error("You cannot get the events of the Device parent class.");
		}

		// If the subclass doesn't have its own `_events`
		if (!Object.prototype.hasOwnProperty.call(this, "_events")) {
			// Make an events `Map` on the subclass
			Object.defineProperty(this, "_events", {
				value: new Map(),
			});
		}

		// Return the events
		return this._events;
	}
}
