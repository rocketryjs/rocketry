/*
	Module dependencies
*/
const types = require("./types.js");


module.exports = {
	// Add supported device configurations
	add(name, data) {
		types[name] = data;

		// Method chaining
		return this;
	},
	// Remove supported device configurations
	remove(name) {
		if (types[name]) {
			delete types[name];
		}

		// Method chaining
		return this;
	},
	// Extend / replace supported device configurations TODO: remove in favor of class extends
	extend(child, parent, data) {
		// Prototyping config children
		(function setChildPrototype(object) {
			for (const key in object) {
				if (typeof object[key] === "object") {
					// Set prototype
					Object.setPrototypeOf(object[key], types[parent][key]);
					// Recursive
					setChildPrototype(object);
				}
			}
		})(data);
		// Prototyping config
		Object.setPrototypeOf(data, types[parent]);

		types[child] = data;

		// Method chaining
		return this;
	},


	// Run the regex for the supported devices, getting the first capture group
	/*
		Example:
			From: "3- Launchpad MK2" (not a key in `types`, from port names)
			To: "Launchpad MK2" (is a key, from the type's class's regex getter's first capture group)
	*/
	getMatchingKey(name) {
		const match = name.match(this.regex);

		if (match) {
			// Return either the first capture group in the match (in case of regex) or the match (in case of string or regex without a first capture group)
			return match[1] || match;
		} else {
			throw new Error(`Your device, ${name}, is not supported.`);
		}
	},


	get regex() {
		// Get all names, or regex strings that get a name
		const names = [];
		for (const key in types) {
			if (types[key].regex) {
				names.push(types[key].regex);
			} else {
				names.push(types[key].name);
			}
		}

		// Generate and return regex from above
		return new RegExp(`^(?:${names.join(")|(?:")})$`, "i");
	}
};
