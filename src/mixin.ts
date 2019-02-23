/*
	Module: Mixin
	Description: Allows for methods and properties to be shared between objects while retaining class inheritance for syntax
	TODO: use async dynamic imports
*/

// Require and execute mixins
export default function(object, path, ...args) {
	// Require, bind this to object, run with optional arguments
	try {
		return require(path).apply(object, args);
	} catch (error) {
		throw new Error(`Couldn't require mixin at ${path}.\n\n${error}`);
	}
};

// Add shared methods to objects using Object.assign
export const methods = function (object, instanceMethods, staticMethods) {
	if (instanceMethods) {
		Object.assign(object.prototype, instanceMethods);
	}
	if (staticMethods) {
		Object.assign(object, staticMethods);
	}

	return object;
};

// Add getters and setters for properties that can't be mixed-in with methods
export const properties = function (object, instanceProps, staticProps) {
	// Make getters and setters for properties
	// (Object.assign treats properties as such, not getters and setters)
	if (instanceProps) {
		Object.defineProperties(object.prototype, instanceProps);
	}
	if (staticProps) {
		Object.defineProperties(object, staticProps);
	}

	return object;
};

// Add events
export const events = function (object, events) {
	// Add destination staticly
	if (typeof object.events !== "object") {
		object.events = {};
	}

	// Add passed in object of events to the object
	Object.assign(object.events, events);

	return object;
};
