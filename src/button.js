/*
	Module dependencies
*/
// Node Events
const EventEmitter = require("events");
// lodash
const _ = require("lodash");
// Core
const _core = require("./core.js");
// Launchpad class
const Launchpad = require("./launchpad.js");
// Helper functions
const _helper = require("./helper.js");


class Button extends EventEmitter {
	constructor(...args) {
		// EventEmitter
		super();

		// The Launchpad instance it belongs to is either passed through as an argument or the last Launchpad created (for glorious laziness when using only one Launchpad).
		const lastArg = _.last(args);
		if (Launchpad.isLaunchpad(lastArg)) {
			this.launchpad = lastArg;
			args.pop();
		} else {
			this.launchpad = Launchpad.lastInstance;
		}

		// Pad config
		this._pad = this.launchpad.getConfig("buttons.pad");

		// Get values
		for (const object of args) {
			if (typeof args[0] === "object") {
				this._object(object);
			} else {
				// Flatten to work with any configuration of arrays, chunk into two arrays of [x, y] spread (...) those arrays into zip to get [[x, x, x ], [y, y, y]] (please don't hurt me) https://stackoverflow.com/q/876089/2758250
				// coords = _.zip(..._.chunk(_.flattenDeep(coords), 2));
				// const x = coords[0];
				// const y = coords[1];
				this._xy(x, y);
			}
		}

		if (!this.listeners) {
			this.listeners = {};
			for (const event of this.launchpad.events) {
				this.listeners[event] = [];
			}
		}

		// Method chaining
		return this;
	}

	// Get buttons from arguments
	_object(object) {
		// MIDI values in object in arguments (gave one argument with an object that has MIDI values in an array) TODO

		// Set values
		if (!this.values) {
			this.values = [];
		}

		if (object.x && object.y) {
			// keys => x, y
			// Make interable if not array
			const coords = [_helper.toSoftArray(object.x), _helper.toSoftArray(object.y)];
			this._xy(...coords);
		} else if (object.value) {
			// keys => header?, value
			const header = object.header || this._pad._header;
			this.values.push({
				header,
				"note": object.value
			});
		} else if (object.values) {
			// keys => header?, values
			// Iterate through Values
			for (let i = 0; i < object.values.length; i++) {
				const header = object.headers[i] || object.header || this._pad._header;
				this.values.push({
					header,
					"note": object.values[i]
				});
			}
		}
	}
	_xy(x, y) {
		// Coordinates in arguments, coordinate pairs in array in arguments, coordinate pairs arrays in arguments TODO

		x = _.flattenDeep(x);
		y = _.flattenDeep(y);

		// Validate
		// Error if not an array
		if (!Array.isArray(x) || !Array.isArray(y)) {
			throw new TypeError("The x and/or y coordinate in your button wasn't a number or array.");
		}
		// Missing one or more x or y
		if (x.length !== y.length) {
			throw new Error("Can't construct a Button with an uneven coordinate pair.");
		}
		// Not number or not in range of the device's pad
		const xInRange = x.every(value => (_.inRange(value, ...this._pad.x)));
		const yInRange = y.every(value => (_.inRange(value, ...this._pad.y)));
		if (!xInRange || !yInRange) {
			throw new Error("One or more coordinates either isn't a number or in the pad range for your device.");
		}

		// Set values
		if (!this.values) {
			this.values = [];
		}
		for (let i = 0; i < x.length; i++) {
			this.values.push({
				"header": this._pad._header,
				"note": parseInt(`${y[i] + this._pad._offset.y}${x[i] + this._pad._offset.x}`)
			});
		}
	}

	setColor(color) {
		color = this.launchpad.normalizeColor(color);

		for (const value of this.values) {
			this.constructor._setColor(this.header, value, color, this.launchpad);
		}

		// Method chaining
		return this;
	}
	set color(color) {
		// Alias for setColor since both can be useful
		this.setColor(color);
	}

	// Extend EventEmitter methods
	addListener(eventName, listener) {
		this._pushListener(eventName, listener);
		return super.addListener(...arguments);
	}
	on(eventName, listener) {
		this._pushListener(eventName, listener);
		return super.on(...arguments);
	}
	once(eventName, listener) {
		this._pushListener(eventName, listener);
		return super.once(...arguments);
	}
	prependListener(eventName, listener) {
		this._pushListener(eventName, listener);
		return super.prependListener(...arguments);
	}
	prependOnceListener(eventName, listener) {
		this._pushListener(eventName, listener);
		return super.prependOnceListener(...arguments);
	}
	removeListener(eventName, listener) {
		this._pullListener(eventName, listener);
		return super.removeListener(...arguments);
	}
	removeAllListeners(eventName) {
		this._removeListeners(eventName);
		return super.removeAllListeners(...arguments);
	}
	// Record listeners for _core
	_pushListener(eventName, listener) {
		if (this.launchpad.events.includes(eventName)) {
			// TODO: add Button instance if not already in array
			this.listeners[eventName].push(listener);
		} else {
			throw new Error("eventName isn't a valid event.");
		}
	}
	_pullListener(eventName, listener) {
		if (this.launchpad.events.includes(eventName)) {
			// TODO: remove Button instance if all listeners are empty, soft - no error
			_.pull(this.listeners[eventName], listener);
		} else {
			throw new Error("eventName isn't a valid event.");
		}
	}
	_removeListeners(eventName) {
		if (this.launchpad.events.includes(eventName)) {
			// TODO: remove Button instance if all listeners are empty, soft - no error
			this.listeners[eventName] = [];
		} else {
			throw new Error("eventName isn't a valid event.");
		}
	}

	static _setColor(header, led, color, launchpad) {
		let mode;

		if (typeof color === "object") {
			// RGB
			mode = "light rgb";
		} else if (typeof color === "number") {
			// Basic
			mode = "light";
		}

		// Send to core, extra arguments are ignored so no need to remove the header for RGB mode
		_core.send(mode, {header, led, color}, launchpad);
	}
	static isButton(object) {
		return object instanceof this;
	}
}


module.exports = Button;
