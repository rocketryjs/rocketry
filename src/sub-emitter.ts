/*
	Module: Sub emitter class
	Description: Class for emitters that rely on willEmit rather than emitting themselves
*/
import {EventEmitter} from "events";
import {pull} from "lodash";
import {Device} from "./device";

export class SubEmitter extends EventEmitter {
	device: Device;

	constructor (device: Device) {
		super();
		this.device = device;
	}


	// Extend EventEmitter methods
	// I don't believe I can use super and meta program to reduce redundancy.
	// If you can, hit me up with and issue or pull request.
	// I've tried a proxy and just setting to the prototype and they both have their issues.
	addListener (...args: Parameters<NodeJS.EventEmitter["addListener"]>) {
		const result = super.addListener(...args);
		this.updateListeners();

		return result;
	}
	on (...args: Parameters<NodeJS.EventEmitter["on"]>) {
		const result = super.on(...args);
		this.updateListeners();

		return result;
	}
	once (...args: Parameters<NodeJS.EventEmitter["once"]>) {
		const result = super.once(...args);
		this.updateListeners();

		return result;
	}
	prependListener (...args: Parameters<NodeJS.EventEmitter["prependListener"]>) {
		const result = super.prependListener(...args);
		this.updateListeners();

		return result;
	}
	prependOnceListener (...args: Parameters<NodeJS.EventEmitter["prependOnceListener"]>) {
		const result = super.prependOnceListener(...args);
		this.updateListeners();

		return result;
	}
	removeListener (...args: Parameters<NodeJS.EventEmitter["removeListener"]>) {
		const result = super.removeListener(...args);
		this.updateListeners();

		return result;
	}
	removeAllListeners (...args: Parameters<NodeJS.EventEmitter["removeAllListeners"]>) {
		const result = super.removeAllListeners(...args);
		this.updateListeners();

		return result;
	}


	// Record listeners for relaying from Device to Button(s)
	updateListeners () {
		// Assume empty and should remove from instances until a listener is found
		let isEmpty = true;
		const emitters = this.device.emitters;
		const events = Object.keys(this.device.constructor.events);


		for (const event of events) {
			if (this.listenerCount(event)) {
				isEmpty = false;
				break;
			}
		}

		if (isEmpty && emitters.includes(this)) {
			pull(emitters, this);
		} else if (!isEmpty && !emitters.includes(this)) {
			emitters.push(this);
		}
	}
}
