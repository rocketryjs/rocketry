/*
	Module: Launchpad button query selectors mixin
	Description: Methods for querying for Launchpad buttons
*/
/*
	Module dependencies
*/
const {methods, properties} = require("../../mixin.js");
/*
	Hoisted module dependencies
	ButtonArray - required post export because of cross-requiring
*/
let ButtonArray;


// Bind deep for using this through the whole method chain
// npmjs/package/deep-bind didn't work as this simple guy did
const deepBind = function(thisArg, object) {
	let bound;
	switch (typeof object) {
		case "function":
			bound = object.bind(thisArg);
			// fallthrough
		case "object":
			if (!bound) {
				bound = {};
			}
			for (const key in object) {
				if (object.hasOwnProperty(key)) {
					bound[key] = deepBind(thisArg, object[key]);
				}
			}
			break;
		default: {
			return object;
		}
	}

	return bound;
};


// Properties used for selection
// key => name
// value => arguments' names
const props = {
	"name": ["name"],
	"group": ["group"],
	"status": ["status"],
	"column": ["column"],
	"row": ["row"],
	"quadrant": ["quadrant"],
	"note": ["note"],
	"coordinates": ["column", "row"]
};

// Make object to be tested against buttons
const makeObject = function(keys, values) {
	// Generate object from arguments
	const object = {};
	for (let i = 0; i < keys.length; i++) {
		object[keys[i]] = values[i];
	}

	// console.log(keys, values) // TODO: debug

	return object;
};

// Query - main object (function)
// Get using raw object like {"group": "top", "column": 0}
const query = function(value) {
	// console.log(value); // TODO: debug
	return this.get(value).next().value;
};

// Query single by properties
query.by = {};
for (const key in props) {
	query.by[key] = function() {
		// Return first from query generator
		return this.get(
			makeObject(props[key], arguments)
		).next().value;
	};
}

// Query all...
// Again, get using raw objects but return a button array
query.all = function(...values) {
	// console.log(...values); // TODO: debug
	return new ButtonArray(this, ...values);
};

// Query all by properties
query.all.by = {};
for (const key in props) {
	query.all.by[key] = function(...values) {
		// Generate list of objects
		for (let i = 0; i < values.length; i++) {
			const tempValues = Array.isArray(values[i]) ? values[i] : [values[i]];
			values[i] = makeObject(props[key], tempValues);
		}

		// Return a ButtonArray using query.all
		return this.query.all(...values);
	};
}

// Query for group
const groups = [
	"top",
	"right",
	"bottom",
	"left",
	"grid"
];
for (const group of groups) {
	query[group] = query.all.by[group] = function() {
		// Return a ButtonArray using query.all
		return this.query.all({group});
	};
}


module.exports = function() {
	// Methods
	methods(
		// Object to mix into
		this,

		// Instance
		{
			// Generator for matches
			* get(value) {
				for (const button of this.buttons) {
					if (button.test(value)) {
						yield button;
					}
				}
			}
		}
	);


	// Properties, return object
	return properties(
		// Object to mix into
		this,

		// Instance
		{
			// Query selectors from module - smart getter
			"query": {
				get() {
					return Object.defineProperty(this, "query", {
						"value": deepBind(this, query)
					}).query;
				},
			}
		}
	);
};


// ButtonArray - hoisted previously in file
ButtonArray = require("../button-array.js");
