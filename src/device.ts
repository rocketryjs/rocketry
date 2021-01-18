import {EventEmitter} from "events";
import {matchMessage} from "./message";
import {Message, Send, DeviceAPI, Meta, Captures, EventDetails} from "./types";
import {rocketry, PortNumbers, RegisteredMIDILayer, makeSend} from ".";


export type DeviceConstructor<SubClass extends Device<SubClass> | void, SubClassType = unknown> = SubClass extends void ? (
	DeviceAPI & Device<void>
) : (
	DeviceAPI & SubClass & SubClassType
);

export interface Device<SubClass extends Device<SubClass> | void, SubClassType = unknown> {
	// Constructor ain't just a function, it also is the base class, the device API, and the subclass
	constructor: DeviceConstructor<SubClass, SubClassType>;
}

export abstract class Device<SubClass extends Device<SubClass> | void> extends EventEmitter {
	static regex?: RegExp;
	static events?: Map<string, EventDetails>;
	midi: InstanceType<RegisteredMIDILayer>;
	send: Send<void, SubClass>;
	// Set array for Buttons (which are emitters) that are listening to events
	emitters: Array<{
		willEmit (event: string, message: Message, captures: Captures, meta: Meta): boolean;
		emit (event: string, message: Message, captures: Captures, meta: Meta): void;
		updateListeners(): void;
	}> = [];

	constructor (portNumbers?: PortNumbers) {
		// EventEmitter
		super();

		if (!rocketry.midi) {
			throw new Error("No MIDI layer initialized.");
		}
		this.midi = new rocketry.midi(this.receive.bind(this));
		this.send = makeSend(this as unknown as SubClass);

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

	static registerEvent (event: string, details: EventDetails): void {
		if (!this.events) {
			this.events = new Map();
		}
		this.events.set(event, details);
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
		let captures: Captures = {};
		const meta: Meta = {deltaTime};

		// Get captures and matching event name from events object and message
		if (this.constructor.events) {
			for (const [key, {pattern, validate, getMetaData}] of this.constructor.events.entries()) {
				const match = matchMessage(message, pattern);
				if (match) {
					const isValid = typeof validate === "function" ? validate.call(this, message, match) : true;
					if (isValid) {
						// It matches, use this event name
						event = key;
						captures = match;
						if (getMetaData) {
							Object.assign(meta, getMetaData.call(this, message, captures));
						}
						break;
					}
				}
			}
		}

		// Relay to listeners by emitting to all listed emitters
		for (const emitter of this.emitters) {
			if (emitter.willEmit(event, message, captures, meta)) {
				// To buttons
				emitter.emit(event, message, captures, meta);
				// Update in case of .once() or .prependOnceListener()
				emitter.updateListeners();
			}
		}

		// To this device
		this.emit("message", message, captures, meta);
		if (event !== "message") {
			this.emit(event, message, captures, meta);
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
