/*
	Module: Button base
	Description: The basic code all buttons have in class form to be extended
*/
import {Device} from "./device";
import {SubEmitter} from "./sub-emitter";


// lodash's `isMatch` and `isEqual` don't work well with proxies
const matchDeep = function (object: unknown, source: unknown) {
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

export interface Button {
	constructor: typeof Button;
}
export class Button extends SubEmitter {
	constructor (device: Device) {
		// EventEmitter
		super(device);
	}

	test (object: unknown) {
		// Match properties
		return matchDeep(this, object);
	}

	// Determine if the emitter should emit
	willEmit (event: string, message) {
		if (event === "press" || event === "release") {
			return this === message.target;
		}
	}
}
