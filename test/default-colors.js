const rocket = require("../src/index.js");
const myLaunchpad = (
	new rocket.Launchpad()
);
console.log(myLaunchpad);

// How I got these pretty defaults:
for (let column = 0; column < 8; column++) {
	for (let row = 0; row < 8; row++) {
		// Page one (inverted)
		myLaunchpad.output.sendMessage([144, parseInt(`${column + 1}${row + 1}`), parseInt( `${column}${row}`, 8)]);
		// Page two (inverted)
		// myLaunchpad.output.sendMessage([144, parseInt(`${column + 1}${row + 1}`), parseInt( `${column}${row}`, 8) + 64]);
		// Clear
		// myLaunchpad.output.sendMessage([144, parseInt(`${column + 1}${row + 1}`), 0]);
		// Log the table
		// console.log(parseInt(`${column + 1}${row + 1}`), parseInt( `${column}${row}`, 8), parseInt( `${column}${row}`, 8) + 64)
	}
}

// myLaunchpad.output.sendMessage([144, 11, 5]);
// myLaunchpad.output.sendMessage([144, 12, 95]);
// myLaunchpad.output.sendMessage([144, 13, 58]);
// myLaunchpad.output.sendMessage([144, 14, 55]);
// myLaunchpad.output.sendMessage([144, 15, 81]);
// myLaunchpad.output.sendMessage([144, 16, 50]);
// myLaunchpad.output.sendMessage([144, 17, 45]);
// myLaunchpad.output.sendMessage([144, 18, 41]);
// myLaunchpad.output.sendMessage([144, 21, 37]);
// myLaunchpad.output.sendMessage([144, 22, 65]);
// myLaunchpad.output.sendMessage([144, 23, 23]);
// myLaunchpad.output.sendMessage([144, 24, 21]);
// myLaunchpad.output.sendMessage([144, 25, 17]);
// myLaunchpad.output.sendMessage([144, 26, 62]);
// myLaunchpad.output.sendMessage([144, 27, 61]);
// myLaunchpad.output.sendMessage([144, 28, 9]);
// myLaunchpad.output.sendMessage([144, 31, 11]);
// myLaunchpad.output.sendMessage([144, 32, 83]);
// myLaunchpad.output.sendMessage([144, 33, 105]);
// myLaunchpad.output.sendMessage([144, 34, 71]);
// myLaunchpad.output.sendMessage([144, 35, 103]);
// myLaunchpad.output.sendMessage([144, 36, 3]);
// myLaunchpad.output.sendMessage([144, 37, 0]);
// myLaunchpad.output.sendMessage([144, 38, 0]);
