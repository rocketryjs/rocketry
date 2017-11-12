const rocket = require("rocket");
const launchpad = new rocket.Launchpad();

for (let column = 0; column < 8; column++) {
	for (let row = 0; row < 8; row++) {
		const pageOne = parseInt( `${column}${row}`, 8); // Page 1 of the defaults
		const pageTwo = parseInt( `${column}${row}`, 8) + 64; // Page 2 of the defaults
		new rocket.Button(column, row, launchpad).setColor(pageOne); // Change pageOne to pageTwo if you'd like to see those instead
	}
}

// Uncomment this next line, then run again to dark all
// launchpad.output.sendMessage([240, 0, 32, 41, 2, 24, 14, 0, 247]);
