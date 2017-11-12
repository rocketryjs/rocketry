// TODO: remove
const isIterable = function(object) {
	// checks for null and undefined
	if (object == null) {
		return false;
	}
	return typeof object[Symbol.iterator] === "function";
};

// TODO: remove
const toIterable = function(object) {
	if (isIterable) {
		return object;
	} else {
		return [object];
	}
};
