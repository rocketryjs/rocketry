/*
	Module dependencies
*/
const Mk2 = require("./device/launchpad-mk2.js");


// Add supported device configurations
const add = function(name, data) {
	this[name] = data;

	// Method chaining
	return this;
};

// Remove supported device configurations
const remove = function(name) {
	if (this[name]) {
		delete this[name];
	}

	// Method chaining
	return this;
};

// Extend / replace supported device configurations
const extend = function(child, parent, data) {
	// Prototyping config children
	(function setChildPrototype(object) {
		for (const key in object) {
			if (typeof object[key] === "object") {
				// Set prototype
				Object.setPrototypeOf(object[key], this[parent][key]);
				// Recursive
				setChildPrototype(object);
			}
		}
	})(data);
	// Prototyping config
	Object.setPrototypeOf(data, this[parent]);

	this[child] = data;

	// Method chaining
	return this;
};


const device = {
	add,
	remove,
	extend,
	"names": [],
	get deviceRegex() {
		// => /^[\d\s-]*(Launchpad MK2)[\d\s-]*$/i that matches "3- Launchpad MK2 0" but doesn't let the original Launchpad match all other devices that *start or end* that that name by matching the prefix and sufix of portName
		// If this isn't standardized accross MIDI devices or platforms, radio Huston; because we have a problem!
		const names = [];
		for (const key in this) {
			if (this[key].name) {
				names.push(this[key].name);
			}
		}
		return new RegExp(`^\\d+-?\\s+(${Object.keys(this.devices).join(")|(")})\\s+\\d+-?$`, "i");
	}
};


(device
	.add("Launchpad MK2", Mk2)
);


module.exports = device;
