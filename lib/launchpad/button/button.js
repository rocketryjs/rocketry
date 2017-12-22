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


	// Extend EventEmitter methods TODO meta
	addListener() {
		super.addListener(...arguments);
		this.updateListeners();

		// Method chaining
		return this;
	}
	on() {
		super.on(...arguments);
		this.updateListeners();

		// Method chaining
		return this;
	}
	once() {
		super.once(...arguments);
		this.updateListeners();

		// Method chaining
		return this;
	}
	prependListener() {
		super.prependListener(...arguments);
		this.updateListeners();

		// Method chaining
		return this;
	}
	prependOnceListener() {
		super.prependOnceListener(...arguments);
		this.updateListeners();

		// Method chaining
		return this;
	}
	removeListener() {
		super.removeListener(...arguments);
		this.updateListeners();

		// Method chaining
		return this;
	}
	removeAllListeners() {
		super.removeAllListeners(...arguments);
		this.updateListeners();

		// Method chaining
		return this;
	}
	// Record listeners for relaying from Device to Button
	updateListeners() {
		// Assume empty and should remove from instances until a listener is found
		let isEmpty = true;
		const emitters = this.constructor.device.emitters;

		for (let i = 0; i < Object.keys(this.constructor.device.events).length; i++) {
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


	// this.toString => [object Button]
	get [Symbol.toStringTag]() {
		return "Button";
	}


	static is(object) {
		return object instanceof this;
	}
}


module.exports = Button;
