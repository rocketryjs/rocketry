/*
	Module: Button base
	Description: The basic code all buttons have in class form to be extended
*/
import {SubEmitter} from "./sub-emitter";


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


export class Button extends SubEmitter {
	constructor(device, assignProps, defineProps) {
		// EventEmitter
		super();

		this.device = device;

		// Assign coords, name, other properties to query by
		Object.assign(this, assignProps);
		// Dynamic and other properties that must be defined
		Object.defineProperties(this, defineProps);

		// Call the initializers defined on the subclass (e.g. from mixins)
		this.constructor.inits.forEach(init => init.call(this));
	}


	test(object) {
		// Match properties
		return matchDeep(this, object);
	}


	// Determine if the emitter should emit
	willEmit(event, message) {
		if (event === "press" || event === "release") {
			return this === message.target;
		}
	}


	/*
		Get the initializers defined on the subclass (e.x. from mixins)

		TODO: Make this reusable across classes

		- Is used to run code from mixins when a new instance of any subclass of `Button` is created
			- Esentially extending the `constructor()`
		- Intentionally doesn't impelement a method for inheritance
			- Would be too complicated of an API to traverse the prototype for what would disincentivize properly using mixins
			- May change in the future as device support grows
	*/
	static get inits() {
		// Throw if called on raw `Button` class
		// - Is to prevent mixins for subclasses from accidentally polluting the parent class
		// - May be dropped if there's a need for inits in plugins
		if (this === Button) {
			throw Error("You cannot get the initializers of the Button parent class.");
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
}
