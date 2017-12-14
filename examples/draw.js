/* eslint-disable no-console */
/*
	Module dependencies
*/
const rocket = require("../lib/index.js");
const _ = require("lodash");


/*
	Functions
*/
// Add/wipe drawing
const addDrawing = function(color) {
	drawings[currentDrawing] = [];

	for (const y of yRange) {
		drawings[currentDrawing][y] = [];
		for (const x of xRange) {
			const data = {color};
			drawings[currentDrawing][y][x] = data;
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

	if (!drawings[currentDrawing] && mode === "palette") {
		return;
	} else if (!drawings[currentDrawing]) {
		addDrawing("off");
	}
	console.log("loading drawing " + (currentDrawing + 1));
	load(drawings[currentDrawing]);
};

// Load from data
const load = function(data) {
	for (const x of xRange) {
		for (const y of yRange) {
			const value = data[y][x];
			const button = new launchpad.Button([x, y]);

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
const stopPalette = function() {
	if (mode === "palette") {
		// Cleanup palette
		pad.removeListener("press", paletteCallback);
		pad.on("press", paint);
		drawings = tempDrawings;
		currentDrawing = tempCurrentDrawing;
		load(drawings[currentDrawing]);
		mode = "paint";
	}
};
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
	stopPalette();
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
	mode = "palette";

	pad.removeListener("press", paint);
	pad.on("press", paletteCallback);
};

// Paint buttons
const paint = function(deltaTime, message) {
	const y = parseInt(message[1].toString()[0]) - this._buttons.pad.offset.y;
	const x = parseInt(message[1].toString()[1]) - this._buttons.pad.offset.x;
	const button = new launchpad.Button([x, y]);
	let data = drawings[currentDrawing][y][x];

	switch (mode) {
		case "erase": {
			button.dark();
			button.stopFlash();
			button.stopPulse();

			data.color = "off";
			delete data.flash;
			delete data.pulse;

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

			delete data.color;
			delete data.flash;
			data.pulse = currentColor;

			break;
		}
		case "paint":
			// fallthrough
		default: {
			button.setColor(currentColor);

			data.color = currentColor;
			delete data.flash;
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
const xRange = _.range(...launchpad.getConfig("buttons.pad.range.x"));
const yRange = _.range(...launchpad.getConfig("buttons.pad.range.y"));
const totalPadButtons = xRange.length * yRange.length;
const colorRange = _.range(...launchpad.getConfig("colors.basic.range"));
let currentColor = "off";
let mode = "paint";

let currentDrawing = 0;
let drawings = [];
addDrawing("off");

const pad = (
	new launchpad.Button("pad")
		.on("press", paint)
);

console.log("Paint with your Launchpad!\n- up: flashing mode, extra tap to switch back to painting mode\n- down: pulsing mode, extra tap to switch back to painting mode\n- left/right: navigate drawings/color palette\n- session: clear/destroy drawing\n- user 1: fill current color\n- user 2: eraser mode\n- mixer: clear pad and exit program\n- right buttons: color palette, extra tap to use custom color\n\nSee the wiki for documentation.");


/*
	Toolbars
*/
// Up arrow: flash
(
	new launchpad.Button("top.up")
		.setColor("orange")
		.on("press", function() {
			stopPalette();

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
	new launchpad.Button("top.down")
		.setColor("orange")
		.on("press", function() {
			stopPalette();

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
	new launchpad.Button("top.left")
		.setColor("grey")
		.on("press", function() {
			switchDrawing("left");
		})
);
(
	new launchpad.Button("top.right")
		.setColor("grey")
		.on("press", function() {
			switchDrawing("right");
		})
);

// Session: clear all
(
	new launchpad.Button("top.session")
		.setColor(7) // Dark red
		.on("press", function() {
			console.log("clearing drawing");
			// Exit palette
			stopPalette();

			if (drawings.length - 1 === currentDrawing && drawings.length > 1) {
				drawings.pop();
				switchDrawing("left");
			} else {
				addDrawing("off");
				pad.dark();
			}
		})
);

// User 1: fill tool
(
	new launchpad.Button("top.user 1")
		.setColor("blue")
		.on("press", function() {
			stopPalette();

			console.log("filling with " + currentColor);
			addDrawing(currentColor);
			pad.setColor(currentColor);
		})
);

// User 2: eraser
(
	new launchpad.Button("top.user 2")
		.setColor("white")
		.on("press", function() {
			stopPalette();

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
	new launchpad.Button("top.mixer")
		.setColor("red")
		.on("press", function() {
			console.log("hiding UI");
			(
				new launchpad.Button("top", "right")
					.dark()
			);
		})
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
		new launchpad.Button("right." + Object.keys(rightBar)[i])
			.setColor(paletteDefaults[i])
			.on("press", function() {
				if (tempPaletteButton === this && mode === "palette") {
					stopPalette();
					return;
				}

				if (currentColor === this.paletteColor && mode === "paint") {
					colorPalette(this);
				} else {
					stopPalette();
					mode = "paint";
					console.log("switching to " + this.paletteColor);
					currentColor = this.paletteColor;
				}
			})
			.paletteColor = paletteDefaults[i]
	);
}
