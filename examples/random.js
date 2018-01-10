/*
	Module: Random example
	Description: Lights all buttons with random colors every 0.5 seconds
	Compatibility: RGB capable launchpads
*/
/*
	Module dependencies
*/
// Node.js util (for timers)
require("util");
// Lodash
const _ = require("lodash");
// Rocket
const rocket = require("../lib/index.js");


// Create new launchpad
const launchpad = new rocket();

// Light each button using lodash's simple random function
const lightRandom = function() {
	for (const button of launchpad.buttons) {
		// All standard color values except off
		button.light(_.random(1, 127));
	}
};

// Create an interval to do it every 500ms (you can change with `ms`)
const ms = 500;
const interval = setInterval(() => {
	lightRandom();
}, ms);


// Cleanup before interupt
console.log("Use `Ctrl + C` (interupt) to reset and exit.");
process.on("SIGINT", () => {
	// Stop repeating
	clearInterval(interval);
	// Clear the buttons
	launchpad.reset();
	// CLose the IO to the launchpad
	launchpad.close();
});
