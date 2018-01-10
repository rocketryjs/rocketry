/*
	Manual integration tests for devices
	Description: Shows and checks your debug information about your connected devices
	Compatibility: All Rocket supported devices, other MIDI devices

	Tested - functions that are tested fully or partially in this document - found in `describe()`
*/


/*
	Module dependencies
*/
// Assertion library
const expect = require("chai").expect;
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
const rocket = require("../../lib/index.js");


// MIDI I/O
const input = new midi.input();
const output = new midi.output();

// Device names, ports, support
// TODO: add API features for these and then use them in here
const getDeviceInfo = function(port, portName) {
	// Get names of ports
	const names = rocket.core.getAllPortNames(port);

	// For all ports in input/output
	for (let i = 0; i < names.length; i++) {
		// Push into ports
		ports.push({
			"port": portName === "output" ? chalk.yellow("output") : chalk.cyan("input"),
			"number": chalk.gray(i),
			"name": names[i],
			"supported": names[i].match(rocket.support.regex) ? chalk.green("true") : chalk.red("false")
		});
	}
};
// Set array of ports
const ports = [];
const portTypes = {input, output};
for (const key in portTypes) {
	getDeviceInfo(portTypes[key], key);
}

const logResults = function() {
	// Generate arrays
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
};
// Do it!
logResults();


describe("devices", function() {
	// Don't timeout manual tests
	this.timeout(0);
	// Never show slow warnings
	this.slow(Infinity);


	it("should output all of your devices' ports", async function() {
		const {confirm} = await inquirer.prompt([{
			"type": "confirm",
			"name": "confirm",
			"message": "Do you see all of your expected devices and their ports in the table?"
		}]);

		expect(
			confirm
		).to.be.true;
	});

	it("should show support for all supported devices", async function() {
		const {confirm} = await inquirer.prompt([{
			"type": "confirm",
			"name": "confirm",
			"message": "Do you see all of your expected devices shown as supported?"
		}]);

		expect(
			confirm
		).to.be.true;
	});

	after("close ports", function() {
		// Prevent `RtMidiIn::cancelCallback: no callback function was set!` error
		// Sometimes node-midi doesn't exit nicely when closing I/O without a callback but it also doesn't exit when it doesn't have one.
		// For testing, use `ctrl + c` or `process.exit();` if this doesn't work for you.
		// Related: justinlatimer/node-midi#117
		input.openPort(0);
		output.openPort(0);

		// Close MIDI I/O ports
		input.closePort();
		output.closePort();
	});
});
