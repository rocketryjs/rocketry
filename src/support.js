/*
	Device Support

	If you create your own support for a Novation MIDI controlller, you can use a similar syntaxt to below in your own code, just make sure it runs before your first `new rocket.Launchpad()` And since you've added support or make a helpful change, you could also contribute it to the project. ;)
*/


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
// TODO: test replacement by extendSupportedDevice("Launchpad MK2", "Launchpad MK2", {"test": poop})
const extendSupportedDevice = function(child, parent, data) {
	if (!this.devices) {
		this.devices = {};
	}

	// Clumsy way TODO: remove when done
	// data = Object.assign(this._core.supportedDevices[parent], data);

	// Prototyping way
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
	.add("Launchpad MK2", require("./config/launchpad-mk2.js"))
);


module.exports = support;
