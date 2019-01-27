/*
	Manual integration test helpers
	Description: TODO
*/


/*
	Module dependencies
*/
// Questioning the user
const inquirer = require("inquirer");
// Console text coloring
const chalk = require("chalk");
// Markdown table creator
const table = require("markdown-table");
// Strip ANSI
const strip = require("strip-ansi");
// lodash
const _ = require("lodash");
// MIDI
const midi = require("midi");
// Rocket
const rocket = require("../../../lib/index.js");


// Setup and reset
const setup = function(test) {
	// Don't timeout manual tests
	test.timeout(0);
	// Never show slow warnings
	test.slow(Infinity);

	// Method chaining
	return this;
};
setup.for = function(name, test) {
	// Only test the correct device
	if (this.device.constructor.type !== name) {
		test.skip();
	}
};
const reset = function() {
	// Reset device to defaults
	this.device.reset();
	// Close connection to the device
	this.device.close();

	// Method chaining
	return this;
};
reset.for = function(name, test) {
	// Setup
	setup(test);
};


module.exports = {
	// Device names, ports, support
	// TODO: add API features for getPorts and getDevices
	getPorts(port, portName) {
		// Get names of ports
		const names = rocket.core.getAllPortNames(port);
		const results = [];

		// For all ports in input/output
		for (let i = 0; i < names.length; i++) {
			// Push into ports
			results.push({
				"port": portName === "output" ? chalk.yellow("output") : chalk.cyan("input"),
				"number": chalk.gray(i),
				"name": names[i],
				"supported": names[i].match(rocket.support.regex) ? chalk.green("true") : chalk.red("false")
			});
		}

		return results;
	},
	getDevices() {
		// MIDI I/O
		const input = new midi.input();
		const output = new midi.output();
		// Set array of ports
		const results = [];
		const portTypes = {input, output};
		for (const key in portTypes) {
			results.push(this.getPorts(portTypes[key], key));
		}

		// Open and close ports
		// Prevent `RtMidiIn::cancelCallback: no callback function was set!` error
		// Sometimes node-midi doesn't exit nicely when closing I/O without a callback but it also doesn't exit when it doesn't have one.
		// For testing, use `ctrl + c` or `process.exit();` if this doesn't work for you.
		// Related: justinlatimer/node-midi#117
		input.openPort(0);
		output.openPort(0);
		// Close MIDI I/O ports
		input.closePort();
		output.closePort();

		return [...results];
	},
	logDevices() {
		// Generate arrays
		const ports = this.getDevices();
		// Header
		const header = Object.keys(ports[0]);
		const headerCap = _.map(header, _.capitalize);
		// Rows
		const rows = [];
		for (const port of ports) {
			rows.push(
				_.without(
					_.union(
						..._.toPairs(port)
					),
					...header
				)
			);
		}

		// Markdown table
		const infoTable = table([
			// Header
			headerCap,
			// Rows
			...rows
		], {
			stringLength(cell) {
				return strip(cell).length;
			}
		});

		// Log
		console.log("\n\nCurrent Devices:\n\n" + infoTable);
	},


	// Get a device to test on
	get device() {
		return this._device ? this._device : this._device = new rocket();
	},


	// Setup test
	setup,
	// Reset test
	reset,


	// Ask the tester (doesn't timeout)
	async ask(message) {
		// Chalk
		// Bright colors
		message = message.replace(/\b(light|bright)([\W])(black|red|green|yellow|blue|magenta|cyan|white|gray)\b/gi, (match, modifier, space, word) => (chalk[word + "Bright"](modifier + space + word)));
		// Colors
		message = message.replace(/\b(black|red|green|yellow|blue|magenta|cyan|white|gray)\b/gi, (match, word) => (chalk[word](word)));
		// Pass
		message = message.replace(/\b(pass(?:ing)?)\b/gi, (match, word) => (chalk.green(word)));
		// Fail
		message = message.replace(/\b(fail(?:ing)?)\b/gi, (match, word) => (chalk.red(word)));
		// Inside string
		message = message.replace(/"(.*?)"/gi, (match, word) => ("\"" + chalk.yellow(word) + "\""));
		// Underline important words
		message = message.replace(/\b(all|not|some|every|none|and|just|or|but)\b/gi, (match, word) => (chalk.underline(word)));

		// Inquire
		const {confirm} = await inquirer.prompt([{
			"prefix": "",
			"type": "confirm",
			"name": "confirm",
			message
		}]);

		// Return boolean
		return confirm;
	},


	// View event data
	logEvent(message) {
		console.log(`Message: [${chalk.yellow(message.join(", "))}]`);

		for (const key in message) {
			if (message.hasOwnProperty(key)) {
				let value = message[key];
				if (Array.isArray(value)) {
					value = `[${chalk.yellow(value.join(", "))}]`;
				} else {
					value = chalk.yellow(value);
				}

				console.log(`${key}: ${value}`);
			}
		}
	}
};
