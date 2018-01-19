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


/*
	Values used for selection
*/
// Properties used for selection
// key => name
// value => arguments' names
const props = {
	"name": ["name"],
	"group": ["group"],
	"status": ["status"],
	"column": ["column"],
	"row": ["row"],
	"x": ["column"],
	"y": ["row"],
	"quadrant": ["quadrant"],
	"quad": ["quadrant"],
	"note": ["note"],
	"coordinates": ["column", "row"],
	"coords": ["column", "row"]
};
// Groups used for selection
const groups = [
	"top",
	"right",
	"bottom",
	"left",
	"grid"
];


/*
	Helper functions
*/
// Make object to be tested against buttons
const makeObject = function(keys, values) {
	// Generate object from arguments
	const object = {};
	for (let i = 0; i < keys.length; i++) {
		object[keys[i]] = values[i];
	}

	return object;
};


/*
	Query for button(s) by raw values like {"group": "top", "column": 0}
*/
// Use generator to get one
const single = function(value) {
	return this.get(value).next().value;
};
// Return ButtonArray that'll use the generator to get all
const all = function(...values) {
	if (values.length === 0) {
		// Get all in buttons as a new array if values is empty
		return new ButtonArray(this, {});
	} else {
		// Query for values if present
		return new ButtonArray(this, ...values);
	}
};


/*
	Query for button(s) by key and values
*/
// Query single by properties
const by = function(key, ...values) {
	// Return first from query generator
	return single.call(this, makeObject(props[key], values));
};
// Query all by properties
const allBy = function(key, ...values) {
	// Generate list of objects
	for (let i = 0; i < values.length; i++) {
		const tempValues = Array.isArray(values[i]) ? values[i] : [values[i]];
		values[i] = makeObject(props[key], tempValues);
	}

	// Return a ButtonArray using query.all
	return all.call(this, ...values);
};


/*
	Query buttons by group
*/
const byGroup = function(group) {
	// Return a ButtonArray using query.all
	return all.call(this, {group});
};


/*
	`query.*` handlers
*/
const byHandler = {
	get(target, property) {
		return by.bind(target.this, property);
	}
};
const allByHandler = {
	get(target, property) {
		if (groups.includes(property)) {
			// this.query.all.by.grid (etc.)
			return () => (byGroup.call(target.this, property));
		} else {
			// this.query.all.by.* (everything else)
			return allBy.bind(target.this, property);
		}

	}
};
const allHandler = {
	apply(target, thisArg, argumentsList) {
		// this.query.all()
		return all.apply(target.this, argumentsList);
	},
	get(target, property) {
		if (property === "by") {
			// this.query.all.by
			return new Proxy(target, allByHandler);
		}
		if (Object.keys(props).includes(property)) {
			// this.query.all.column (etc.)
			return Reflect.get(target.this.query.all.by, property);
		}
		if (groups.includes(property)) {
			// this.query.all.grid (etc.)
			return () => (byGroup.call(target.this, property));
		}
	}
};


/*
	Make a query proxy with a `target.this`
*/
// Query proxy handler
const handler = {
	apply(target, thisArg, argumentsList) {
		// this.query()
		return single.apply(target.this, argumentsList);
	},
	get(target, property) {
		if (property === "by") {
			// this.query.by
			return new Proxy(target, byHandler);
		}
		if (property === "all") {
			// this.query.all
			return new Proxy(target, allHandler);
		}
		if (Object.keys(props).includes(property)) {
			// this.query.column (etc.)
			return Reflect.get(target.this.query.all.by, property);
		}
		if (groups.includes(property)) {
			// this.query.grid (etc.)
			return () => (byGroup.call(target.this, property));
		}
	}
};
// Make query using handler and thisArg
const makeQuery = function(thisArg) {
	// `handler.apply` requires a function target, but object
	const target = function() {};
	// Assign this for passing through proxies' targets
	target.this = thisArg;

	// Return proxy
	return new Proxy(target, handler);
};


/*
	Export mixin
*/
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


	// Properties
	properties(
		// Object to mix into
		this,

		// Instance
		{
			// Query selectors from module - smart getter
			"query": {
				get() {
					return Object.defineProperty(this, "query", {
						"value": makeQuery(this)
					}).query;
				},
			}
		}
	);
};


// ButtonArray - hoisted previously in file
ButtonArray = require("../button-array.js");
