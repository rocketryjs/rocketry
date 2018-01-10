/*
	Module: Random example
	Description: Lights all buttons with random colors every 0.5 seconds
	Compatibility: RGB capable launchpads
	WARNING: Do not run if you are sensitive to flashing lights
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

// Create an interval to do it every 500ms (you can change with a command line argument with the ms to use)
const ms = parseInt(process.argv[2]) || 500;
const interval = setInterval(() => {
	lightRandom();
}, ms);


// Cleanup before interupt
console.log("Use `ctrl + c` (interrupt) to reset and exit.");
process.on("SIGINT", () => {
	console.log("Exiting...");
	// Stop repeating
	clearInterval(interval);
	// Clear the buttons
	launchpad.reset();
	// Close the IO to the launchpad
	launchpad.close();
});
