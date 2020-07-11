class Device {
	constructor() {
		this.constructor.inits.forEach(init => init.call(this));
	}
	/*
		Get the initializers defined on the subclass (e.x. from mixins)

		- Is used to run code from mixins when a new instance of any subclass of `Device` is created
			- Esentially extending the `constructor()`
		- Intentionally doesn't impelement a method for inheritance
			- Would be too complicated of an API to traverse the prototype for what would disincentivize properly using mixins
			- May change in the future as device support grows
	*/
	static get inits () {
		// Throw if called on raw `Device` class
		// - Is to prevent mixins for subclasses from accidentally polluting the parent class
		// - May be dropped if there's a need for inits in plugins
		if (this === Device) {
			throw Error("You cannot get the initializers of the Device parent class.");
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

class Launchpad extends Device {
	test() {
		console.log("Yay!");
	}
}

const mixinWithInit = function (target) {
	target.inits.add(
		function () {
			this.test();
		}
	);
}
mixinWithInit(Launchpad);
