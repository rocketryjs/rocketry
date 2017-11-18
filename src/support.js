/*
	Module dependencies
*/
const MK2 = require("./config/launchpad-mk2.js");


// Add supported device configurations
const addSupportedDevice = function(name, data) {
	if (!this.devices) {
		this.devices = {};
	}

	this.devices[name] = data;

	// Method chaining
	return this;
};

// Remove supported device configurations
const removeSupportedDevice = function(name) {
	if (this.devices[name]) {
		delete this.devices[name];
	}

	// Method chaining
	return this;
};

// Extend / replace supported device configurations
const extendSupportedDevice = function(child, parent, data) {
	if (!this.devices) {
		this.devices = {};
	}

	// Prototyping config children
	(function setChildPrototype(object) {
		for (const key in object) {
			if (typeof object[key] === "object") {
				// Set prototype
				Object.setPrototypeOf(object[key], this.devices[parent][key]);
				// Recursive
				setChildPrototype(object);
			}
		}
	})(data);
	// Prototyping config
	Object.setPrototypeOf(data, this.devices[parent]);

	this.devices[child] = data;

	// Method chaining
	return this;
};


const support = {
	"add": addSupportedDevice,
	"remove": removeSupportedDevice,
	"extend": extendSupportedDevice,
	get deviceRegex() {
		// => /^[\d\s-]*(Launchpad MK2)[\d\s-]*$/i that matches "3- Launchpad MK2 0" but doesn't let the original Launchpad match all other devices that *start or end* that that name by matching the prefix and sufix of portName
		// If this isn't standardized accross computers, radio Huston; because we have a problem!
		return new RegExp(`^\\d+-?\\s+(${Object.keys(this.devices).join(")|(")})\\s+\\d+-?$`, "i");
	}
};


(support
	.add("Launchpad MK2", MK2)
);


module.exports = support;
