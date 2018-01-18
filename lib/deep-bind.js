/*
	Module: Deep bind
	Description: Helper for binding a function or object deeply
*/


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


module.exports = deepBind;
