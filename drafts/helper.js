/*
	Helper functions
*/

const toSoftArray = function(object) {
	if (Array.isArray(object)) {
		return object;
	} else {
		return [object];
	}
};


module.exports = {
	toSoftArray
};
