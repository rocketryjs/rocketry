/*
	Module: Button base
	Description: The basic code all buttons have in class form to be extended
*/
/*
	Module dependencies
*/
// Node Events
const EventEmitter = require("events");
// lodash
const _ = require("lodash");


class Button extends EventEmitter {
	constructor(device, object) {
		// EventEmitter
		super();

		this.device = device;

		// Assign note, coords, name, etc
		Object.assign(this, object);
	}


	test(object) {
		return _.isMatch(this, object);
	}


	// Extend EventEmitter methods
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

		for (let i = 0; i < Object.keys(this.device.constructor.events).length; i++) {
			if (this.listeners.length > 0) {
				isEmpty = false;
			}
		}

		if (isEmpty && emitters.includes(this)) {
			_.pull(emitters, this);
		} else if (!isEmpty && !emitters.includes(this)) {
			emitters.push(this);
		}
	}
	// Determine if the emitter should emit
	willEmit(event, message) {
		if (event === "press" || event === "release") {
			const hasSameNote = this.note === message.note[0];
			const statusText = _.inRange(message.status[0], 144, 160) ? "note on" : "control change";
			const hasSameStatus = this.status === statusText;

			return hasSameNote && hasSameStatus;
		}
	}


	// this.toString => [object Button]
	get [Symbol.toStringTag]() {
		return "Button";
	}


	static is(object) {
		return object instanceof this;
	}
}


module.exports = Button;
