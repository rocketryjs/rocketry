/*
	Module: Button base
	Description: The basic code all buttons have in class form to be extended
*/
/*
	Module dependencies
*/
const SubEmitter = require("./sub-emitter.js");


// lodash's `isMatch` and `isEqual` don't work well with proxies
const matchDeep = function(object, source) {
	if (typeof source === "object" || typeof source === "function") {
		for (const key in source) {
			const keyMatched = matchDeep(object[key], source[key]);
			if (!keyMatched) {
				return false;
			}
		}

		return true;
	} else {
		return object === source;
	}
};


class Button extends SubEmitter {
	constructor(device, object) {
		// EventEmitter
		super();

		this.device = device;

		// Assign note, coords, name, etc
		Object.assign(this, object);
	}


	test(object) {
		// Match properties
		return matchDeep(this, object);
	}


	// Determine if the emitter should emit
	willEmit(event, message) {
		if (event === "press" || event === "release") {
			return this.note === message.note;
		}
	}


	static is(object) {
		return object instanceof this;
	}
}


module.exports = Button;
