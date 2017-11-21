/* eslint-disable no-console */
/*
	Module dependencies
*/
const rocket = require("../src/index.js");
const _ = require("lodash");


/*
	Functions
*/
// Add/wipe drawing
const addDrawing = function() {
	drawings[currentDrawing] = [];

	for (const y of yRange) {
		drawings[currentDrawing][y] = [];
		for (const x of xRange) {
			drawings[currentDrawing][y][x] = {};
		}
	}
};

// Switch drawing
const switchDrawing = function(direction) {
	if (direction === "right") {
		currentDrawing += 1;
	} else if (direction === "left" && currentDrawing > 0) {
		currentDrawing -= 1;
	} else {
		return;
	}

	if (!drawings[currentDrawing]) {
		addDrawing();
	}
	console.log("loading drawing " + currentDrawing);
	load(drawings[currentDrawing]);
};

// Load from data
const load = function(data) {
	for (const x of xRange) {
		for (const y of yRange) {
			const value = data[y][x];
			const button = new rocket.Button([x, y], launchpad);

			if (value.color) {
				button.setColor(value.color);
			} else {
				button.dark();
			}

			if (value.flash) {
				button.flash(value.flash);
			} else if (value.pulse) {
				button.pulse(value.pulse);
			}
		}
	}
};

// Show large color palette
let tempDrawings;
let tempCurrentDrawing;
let tempPaletteButton;
const paletteCallback = function(deltaTime, message) {
	const y = parseInt(message[1].toString()[0]) - this._buttons.pad.offset.y;
	const x = parseInt(message[1].toString()[1]) - this._buttons.pad.offset.x;
	const color = drawings[currentDrawing][y][x].color;

	// Set paletteColor
	tempPaletteButton.paletteColor = color;
	tempPaletteButton.setColor(color);
	console.log("switching to " + color);
	currentColor = color;

	// Cleanup
	this.removeListener("press", paletteCallback);
	this.on("press", paint);
	drawings = tempDrawings;
	currentDrawing = tempCurrentDrawing;
	load(drawings[currentDrawing]);
};

const colorPalette = function(button) {
	// Generate palette drawings
	const colorPalette = [];
	const pages = Math.ceil(colorRange.length / totalPadButtons);
	for (let page = 0; page < pages; page++) {
		colorPalette[page] = [];
		for (const y of yRange) {
			colorPalette[page][y] = [];
			for (const x of xRange) {
				const color = (x + (y * xRange.length)) + (totalPadButtons * page);
				if (!colorRange.includes(color)) {
					continue;
				}

				colorPalette[page][y][x] = {color};
			}
		}
	}

	if (_.isEqual(drawings, colorPalette)) {
		// Already in color palette mode
		return;
	}
	// Save button
	tempPaletteButton = button;
	// Save drawings
	tempDrawings = drawings;
	tempCurrentDrawing = currentDrawing;
	// Override drawings
	drawings = colorPalette;
	currentDrawing = 0;

	console.log(`loading palette as ${pages} drawing(s)...`);
	load(drawings[currentDrawing]);

	pad.removeListener("press", paint);
	pad.on("press", paletteCallback);
};

// Paint buttons
const paint = function(deltaTime, message) {
	const y = parseInt(message[1].toString()[0]) - this._buttons.pad.offset.y;
	const x = parseInt(message[1].toString()[1]) - this._buttons.pad.offset.x;
	const button = new rocket.Button([x, y], launchpad);
	let data = drawings[currentDrawing][y][x];

	switch (mode) {
		case "erase": {
			button.dark();
			button.stopFlash();
			button.stopPulse();
			data = {};
			break;
		}
		case "flash": {
			button.flash(currentColor);
			data.flash = currentColor;
			delete data.pulse;
			break;
		}
		case "pulse": {
			button.pulse(currentColor);
			data = {
				"pulse": currentColor
			};
			break;
		}
		case "paint":
			// fallthrough
		default: {
			button.setColor(currentColor);
			data.color = currentColor;
			delete data.pulse;
		}
	}
};


/*
	Setup
*/
const launchpad = (
	new rocket.Launchpad()
);
const xRange = _.range(...launchpad.getConfig("buttons.pad.x"));
const yRange = _.range(...launchpad.getConfig("buttons.pad.y"));
const totalPadButtons = xRange.length * yRange.length;
const colorRange = _.range(...launchpad.getConfig("colors.basic.range"));
let currentColor = "off";
let mode = "paint";

let currentDrawing = 0;
let drawings = [];
addDrawing();

const pad = (
	new rocket.Button("pad", launchpad)
		.on("press", paint)
);

console.log("Paint with your Launchpad!\nup: flashing mode, extra tap to switch back to painting mode\ndown: pulsing mode, extra tap to switch back to painting mode\nleft/right: navigate drawings/color palette\nsession: clear/destroy drawing\nuser 1: fill current color\nuser 2: eraser mode\nmixer: clear pad and exit program\nright buttons: color palette, extra tap to use custom color");


/*
	Toolbars
*/
// Up arrow: flash
(
	new rocket.Button("top.up", launchpad)
		.setColor("orange")
		.on("press", function() {
			if (mode === "flash") {
				console.log("painting mode");
				mode = "paint";
			} else {
				console.log("flashing mode");
				mode = "flash";
			}
		})
);

// Down arrow: pulse
(
	new rocket.Button("top.down", launchpad)
		.setColor("orange")
		.on("press", function() {
			if (mode === "pulse") {
				console.log("painting mode");
				mode = "paint";
			} else {
				console.log("pulsing mode");
				mode = "pulse";
			}
		})
);

// Horizonal arrows: navigate drawings
(
	new rocket.Button("top.left", launchpad)
		.setColor("grey")
		.on("press", function() {
			console.log("getting previous drawing...");
			switchDrawing("left");
		})
);
(
	new rocket.Button("top.right", launchpad)
		.setColor("grey")
		.on("press", function() {
			console.log("getting next drawing...");
			switchDrawing("right");
		})
);

// Session: clear all
(
	new rocket.Button("top.session", launchpad)
		.setColor(7) // Dark red
		.on("press", function() {
			console.log("clearing drawing");
			if (drawings.length - 1 === currentDrawing && drawings.length > 1) {
				drawings.pop();
				switchDrawing("left");
			} else {
				addDrawing();
				pad.dark();
			}
		})
);

// User 1: fill tool
(
	new rocket.Button("top.user 1", launchpad)
		.setColor("blue")
		.on("press", function() {
			console.log("filling with " + currentColor);
			pad.setColor(currentColor);
		})
);

// User 2: eraser
(
	new rocket.Button("top.user 2", launchpad)
		.setColor("white")
		.on("press", function() {
			if (mode === "erase") {
				console.log("painting mode");
				mode = "paint";
			} else {
				console.log("erasing mode");
				mode = "erase";
			}
		})
);

// Mixer: exit
(
	new rocket.Button("top.mixer", launchpad)
		.setColor("red")
		.on("release", function() {
			console.log("exiting...");
			launchpad.dark();
			launchpad.close();
		})
);

// Right bar: colors with presets, double press to popout palette to change the color
const paletteDefaults = ["red", "pink", "deep purple", "blue", "cyan", "green", "yellow", "orange"];
const rightBar = launchpad.getConfig("buttons.right");
for (let i = 0; i <= 7; i++) {
	(
		new rocket.Button("right." + Object.keys(rightBar)[i], launchpad)
			.setColor(paletteDefaults[i])
			.on("press", function() {
				if (currentColor === this.paletteColor) {
					colorPalette(this);
				} else {
					console.log("switching to " + this.paletteColor);
					currentColor = this.paletteColor;
				}
			})
			.paletteColor = paletteDefaults[i]
	);
}
