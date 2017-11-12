// TODO: use flashing and pulsing?

/*
	Module dependencies
*/
const rocket = require("../src/index.js");


/*
	Functions
*/
// Load from data
const load = function(data) {
	for (let column = 0; column <= 7; column++) {
		for (let row = 0; row <= 7; row++) {
			(
				new rocket.Button(column, row, launchpad)
					.setColor(data[column][row])
			);
		}
	}
};


/*
	Setup
*/
const launchpad = (
	new rocket.Launchpad()
);
// Compatibility
// TODO: work with mini, s, and pro
// Initial values
let drawing = [
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0]
];


/*
	Toolbars
*/
// Arrows: navigate all drawings
(
	new rocket.Button("up", "down", "left", "right", launchpad)
		.setColor("grey")
);
// Session: clear all w/ confirm
(
	new rocket.Button("session", launchpad)
		.setColor(7) // Dark red
);
// User 1: fill tool
(
	new rocket.Button("user 1", launchpad)
		.setColor("blue")
);
// User 2: eraser
(
	new rocket.Button("user 2", launchpad)
		.setColor("white")
);
// Mixer: exit
(
	new rocket.Button("mixer", launchpad)
		.setColor("red")
);
// Right bar: colors with presets, double press to popout palette to change the color
const paletteDefaults = ["red", "pink", "deep purple", "blue", "cyan", "green", "yellow", "orange"];
const rightBar = launchpad.getConfig("buttons.right");
for (let i = 0; i <= 7; i++) {
	(
		new rocket.Button(rightBar[Object.keys(rightBar)[i]], launchpad)
			.setColor(paletteDefaults[i])
	);
}



// Draw Large Palette
// Save drawing, output colors (pagination?), return to saved drawing on press

// Draw Area
// Save drawing when switching between drawings
