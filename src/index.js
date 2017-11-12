// Single property objects
const data = {
	"_core": require("./core.js"),
	"support": require("./support.js"),
	"Launchpad": require("./launchpad.js"),
	"Button": require("./button.js")
};

// Export and add multi-property objects
module.exports = Object.assign(data, require("./column-row.js"));
