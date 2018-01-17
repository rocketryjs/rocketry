/*
	Module: Sub emitter class
	Description: Class for emitters that rely on willEmit rather than emitting themselves
*/
/*
	Module dependencies
*/
const EventEmitter = require("events");
const _ = require("lodash");

class SubEmitter extends EventEmitter {
	constructor() {
		super();
	}


	// Extend EventEmitter methods
	// I don't believe I can use super and meta program to reduce redundancy.
	// If you can, hit me up with and issue or pull request.
	// I've tried a proxy and just setting to the prototype and they both have their issues.
	addListener() {
		const result = super.addListener(...arguments);
		this.updateListeners();

		return result;
	}
	on() {
		const result = super.on(...arguments);
		this.updateListeners();

		return result;
	}
	once() {
		const result = super.once(...arguments);
		this.updateListeners();

		return result;
	}
	prependListener() {
		const result = super.prependListener(...arguments);
		this.updateListeners();

		return result;
	}
	prependOnceListener() {
		const result = super.prependOnceListener(...arguments);
		this.updateListeners();

		return result;
	}
	removeListener() {
		const result = super.removeListener(...arguments);
		this.updateListeners();

		return result;
	}
	removeAllListeners() {
		const result = super.removeAllListeners(...arguments);
		this.updateListeners();

		return result;
	}


	// Record listeners for relaying from Device to Button(s)
	updateListeners() {
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
			_.pull(emitters, this);
		} else if (!isEmpty && !emitters.includes(this)) {
			emitters.push(this);
		}
	}
}


module.exports = SubEmitter;
