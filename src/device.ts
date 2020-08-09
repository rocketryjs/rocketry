/*
	Module: Device base
	Description: The basic code all devices have in class form to be extended
*/
import {EventEmitter} from "events";
import bindDeep from "bind-deep";
import {DeviceAPIClass, Message, States, State} from "./types";
import {rocketry, send, PortNumbers, RegisteredMIDILayer} from ".";


/*
	Functions
*/
const doesByteMatch = function (byte: number, capture, state: State) {
	// Validity
	// If the function exists, execute it. Fallback on true.
	const isValid = typeof state.validate === "function" ? state.validate.call(this, byte, capture) : true;
	// Matching
	// If array exists, match against next item in it. Fallback on true.
	const doesMatch = Array.isArray(state.matches) ? state.matches[capture.length] === byte : true;

	return isValid && doesMatch;
};
const matchBytes = function (bytes: Array<number>, states: States) {
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
		const {mutate} = states[key];

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
	constructor: typeof Device & DeviceAPIClass;
}
export abstract class Device extends EventEmitter {
	static regex?: RegExp;
	static events?: Map<string, States>;
	midi: InstanceType<RegisteredMIDILayer>;
	send = bindDeep(send, this);
	// Set array for Buttons (which are emitters) that are listening to events
	emitters: Array<{
		willEmit (event: string, message: Message, deltaTime: number): boolean;
		emit (event: string, message: Message, deltaTime: number): void;
		updateListeners(): void;
	}> = [];

	constructor (portNumbers: PortNumbers) {
		// EventEmitter
		super();

		if (!rocketry.midi) {
			throw new Error("No MIDI layer initialized.");
		}
		this.midi = new rocketry.midi(this);

		// Properties
		if (!portNumbers) {
			const {input, output} = this.midi.getAllPortNumbers(this.constructor.regex);
			if (input.length && output.length) {
				portNumbers = {
					input: input[0].number,
					output: output[0].number,
				};
			} else {
				throw new Error("No supported device found, try supplying port numbers when creating the device.");
			}
		}

		// Open connection with device
		this.open(portNumbers);
	}

	static registerEvent (event: string, states: States): void {
		if (!this.events) {
			this.events = new Map();
		}
		this.events.set(event, states);
	}

	open (portNumbers: PortNumbers): this {
		this.midi.connect(portNumbers);
		this.midi.addListeners();

		// Notify that the device is open
		this.emit("open");

		// Method chaining
		return this;
	}

	close (): this {
		// Notify closure
		this.emit("close");

		this.midi.removeListeners();
		this.midi.disconnect();

		// Method chaining
		return this;
	}

	// Relay MIDI messages to listeners
	receive (deltaTime: number, message: Message): void {
		let event = "message";
		let captures;

		// Get capture groups and matching event from events object and message
		if (this.constructor.events) {
			for (const [key, value] of this.constructor.events.entries()) {
				captures = matchBytes.call(this, message, value);
				if (captures) {
					// It matches, use this event
					event = key;

					// Assign the matching capture groups
					Object.assign(message, captures);
					break;
				}
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
		if (event !== "message") {
			this.emit(event, message, deltaTime);
		}
	}


	// Return a promise that resolves for an event
	promiseOnce (
		// Event to listen for
		event = "message",
		// Timeout in ms
		timeout = 1000
	): Promise<Message> {
		return new Promise((resolve, reject) => {
			// Hoist timeout
			let timeoutObj: NodeJS.Timeout;

			// Listen for event
			const listener = (message: Message) => {
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
}
