/*
	Manual integration tests for the Launchpad MK2
	Description: Runs supported methods for the Launchpad MK2 and the tester confirms the actions
	Compatibility: Launchpad MK2
	WARNING: Do not run if you are sensitive to flashing lights
	TODO: Share code with Pro and Mini

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
// const table = require("markdown-table");
// Strip ANSI
// const strip = require("strip-ansi");
// lodash
// const _ = require("lodash");
// Rocket
const rocket = require("../../../lib/index.js");


describe("Launchpad MK2", function() {
	// Don't timeout manual tests
	this.timeout(0);
	// Never show slow warnings
	this.slow(Infinity);

	/*
		Hoisting
	*/
	let launchpad;
	// Functions
	// Ask via inquirer
	let ask;
	// View event data
	let viewEvent;


	before(function() {
		// Setup
		launchpad = new rocket();

		// Functions
		// Ask via inquirer
		ask = async function(message) {
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
		};
		// View event data
		viewEvent = function(message) {
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
		};
	});


	after("reset Launchpad", function() {
		// Reset Launchpad to defaults
		launchpad.reset();
		// Close connection to the Launchpad
		launchpad.close();
	});


	it("should get a Launchpad MK2", function() {
		expect(
			rocket.devices["Launchpad MK2"].is(launchpad)
		).to.be.true;
	});


	describe("light()", function() {
		beforeEach("reset color", function() {
			launchpad.dark();
		});

		context("when lighting green using a named color", function() {
			it("should light all buttons green", async function() {
				launchpad.light("green");

				expect(
					await ask("Are all buttons lit green?")
				).to.be.true;
			});
		});

		context("when lighting green using a standard color", function() {
			it("should light all buttons green", async function() {
				launchpad.light(23);

				expect(
					await ask("Are all buttons lit green?")
				).to.be.true;
			});
		});

		context("when lighting green using an RGB color", function() {
			it("should light all buttons green", async function() {
				launchpad.light({
					"red": 0,
					"green": 63,
					"blue": 0
				});

				expect(
					await ask("Are all buttons lit green?")
				).to.be.true;
			});
		});
	});


	describe("dark()", function() {
		context("when previously lit red", function() {
			it("should dark all buttons", async function() {
				launchpad.light("red");
				launchpad.dark();

				expect(
					await ask("Are all buttons dark and not red?")
				).to.be.true;
			});
		});

		context("when previously flashing red", function() {
			it("should dark all buttons", async function() {
				launchpad.flash("red");
				launchpad.dark();

				expect(
					await ask("Are all buttons dark and not flashing red?")
				).to.be.true;
			});
		});

		context("when previously pulsing red", function() {
			it("should dark all buttons", async function() {
				launchpad.pulse("red");
				launchpad.dark();

				expect(
					await ask("Are all buttons dark and not pulsing red?")
				).to.be.true;
			});
		});

		context("when darking while looping text scrolling", function() {
			it("should still be scrolling", async function() {
				launchpad.light("red");
				launchpad.scrollText("green", "PASS", true);
				launchpad.dark();

				expect(
					await ask("Is text scrolling \"PASS\" in green?")
				).to.be.true;
			});

			it("should dark all buttons after scrolling", async function() {
				launchpad.scrollText("red", "FAIL", true);
				launchpad.stopScrollText();

				expect(
					await ask("Are all buttons dark and not text scrolling \"FAIL\" in red?")
				).to.be.true;
			});
		});
	});


	describe("flash()", function() {
		beforeEach("reset color", function() {
			launchpad.dark();
		});

		context("when previously dark", function() {
			it("should flash all buttons", async function() {
				launchpad.flash("green");

				expect(
					await ask("Are all buttons flashing green?")
				).to.be.true;
			});
		});

		context("when previously lit light green", function() {
			it("should flash all buttons", async function() {
				launchpad.light("light green");
				launchpad.flash("green");

				expect(
					await ask("Are all buttons flashing between green and light green?")
				).to.be.true;
			});
		});

		context("when previously flashing red", function() {
			it("should flash all buttons", async function() {
				launchpad.flash("red");
				launchpad.flash("green");

				expect(
					await ask("Are all buttons flashing green?")
				).to.be.true;
			});
		});

		context("when previously pulsing light green", function() {
			it("should flash all buttons", async function() {
				launchpad.pulse("light green");
				launchpad.flash("green");

				expect(
					await ask("Are all buttons flashing green and pulsing (may look solid) light green?")
				).to.be.true;
			});
		});
	});


	describe("stopFlash()", function() {
		beforeEach("reset color", function() {
			launchpad.dark();
		});

		context("when previously dark and flashing red", function() {
			it("should stop flashing buttons", async function() {
				launchpad.flash("red");
				launchpad.stopFlash();

				expect(
					await ask("Are all buttons dark and not flashing red?")
				).to.be.true;
			});
		});

		context("when previously lit green and flashing red", function() {
			it("should stop flashing buttons", async function() {
				launchpad.light("green");
				launchpad.flash("red");
				launchpad.stopFlash();

				expect(
					await ask("Are all buttons lit green and not flashing red?")
				).to.be.true;
			});
		});

		context("when previously pulsing green", function() {
			it("should stop flashing buttons", async function() {
				launchpad.pulse("green");
				launchpad.flash("red");
				launchpad.stopFlash();

				expect(
					await ask("Are all buttons pulsing green?")
				).to.be.true;
			});
		});
	});


	describe("stopPulse()", function() {
		beforeEach("reset color", function() {
			launchpad.dark();
		});

		context("when previously dark and pulsing red", function() {
			it("should stop pulsing buttons", async function() {
				launchpad.pulse("red");
				launchpad.stopPulse();

				expect(
					await ask("Are all buttons dark and not pulsing red?")
				).to.be.true;
			});
		});

		context("when previously lit red and flashing red", function() {
			it("should stop pulsing buttons", async function() {
				launchpad.light("red");
				launchpad.pulse("red");
				launchpad.stopPulse();

				expect(
					await ask("Are all buttons dark and not lit or pulsing red?")
				).to.be.true;
			});
		});
	});


	describe("changeMidiClock()", function() {
		before("flash single button yellow", function() {
			launchpad.buttons[0].flash("yellow");
		});
		beforeEach("reset MIDI clock", function() {
			launchpad.resetMidiClock();
		});
		after("stop flashing, reset MIDI clock", function() {
			launchpad.buttons[0].stopFlash();
			launchpad.resetMidiClock();
		});

		context("when changing the timing to 40 BPM", function() {
			it("should flash very slowly", async function() {
				launchpad.changeMidiClock(40);

				expect(
					await ask("Is a button flashing yellow at around 40 BPM (the minimum supported rate)?")
				).to.be.true;
			});
		});

		context("when changing the timing to 240 BPM", function() {
			it("should flash very quickly", async function() {
				launchpad.changeMidiClock(240);

				expect(
					await ask("Is a button flashing yellow at around 240 BPM (the maximum supported rate)?")
				).to.be.true;
			});
		});
	});


	describe("resetMidiClock()", function() {
		before("flash single button yellow", function() {
			launchpad.buttons[0].flash("yellow");
		});
		after("stop flashing, reset MIDI clock", function() {
			launchpad.buttons[0].stopFlash();
		});

		context("when resetting timing", function() {
			it("should flash at a normal rate", async function() {
				launchpad.resetMidiClock();

				expect(
					await ask("Is a button flashing yellow at around 120 BPM (the normal rate)?")
				).to.be.true;
			});
		});
	});


	describe("scrollText()", function() {
		afterEach("stop scrolling text", function() {
			launchpad.stopScrollText();
		});

		context("when loop flag is on", function() {
			it("should scroll text indefinitely", async function() {
				launchpad.scrollText("yellow", "LOOP", true);

				expect(
					await ask("Is text scrolling \"LOOP\" in yellow in a loop?")
				).to.be.true;
			});
		});

		context("when loop flag is off", function() {
			it("should scroll text once", async function() {
				launchpad.scrollText("yellow", "ONCE", false);

				expect(
					await ask("Did text scrolling \"ONCE\" in yellow happen once?")
				).to.be.true;
			});
		});

		context("when loop flag is omitted", function() {
			it("should scroll text once", async function() {
				launchpad.scrollText("yellow", "ONCE");

				expect(
					await ask("Did text scrolling \"ONCE\" in yellow happen once?")
				).to.be.true;
			});
		});

		context("when the speed is set to 1 at the beginning", function() {
			it("should scroll slowly", async function() {
				launchpad.scrollText("yellow", [1, "111"]);

				expect(
					await ask("Did text scrolling \"111\" in yellow happen slowly?")
				).to.be.true;
			});
		});

		context("when the speed is set to 4 at the beginning", function() {
			it("should scroll at a normal pase", async function() {
				launchpad.scrollText("yellow", [4, "444"]);

				expect(
					await ask("Did text scrolling \"444\" in yellow happen at a normal pase?")
				).to.be.true;
			});
		});

		context("when the speed is set to 7 at the beginning", function() {
			it("should scroll quickly", async function() {
				launchpad.scrollText("yellow", [7, "777"]);

				expect(
					await ask("Did text scrolling \"777\" in yellow happen quickly?")
				).to.be.true;
			});
		});

		context("when the speed is increased progressively", function() {
			it("should scroll progressively quicker", async function() {
				launchpad.scrollText("yellow", [1, "111", 2, "222", 3, "333", 4, "444", 5, "555", 6, "666", 7, "777"]);

				expect(
					await ask("Did text scrolling \"111222333444555666777\" in yellow get progressively quicker?")
				).to.be.true;
			});
		});
	});


	describe("stopScrollText()", function() {
		before("light buttons green", function() {
			launchpad.light("green");
		});
		after("dark buttons", function() {
			launchpad.dark();
		});

		context("when stopping a loop immediately", function() {
			it("should stop scrolling text", async function() {
				launchpad.scrollText("red", "FAIL", true);
				launchpad.stopScrollText();

				expect(
					await ask("Did text scrolling \"FAIL\" in red stop immediately and show all buttons lit green?")
				).to.be.true;
			});
		});

		context("when stopping a single scroll immediately", function() {
			it("should stop scrolling text", async function() {
				launchpad.scrollText("red", "FAIL", false);
				launchpad.stopScrollText();

				expect(
					await ask("Did text scrolling \"FAIL\" in red stop immediately and show all buttons lit green?")
				).to.be.true;
			});
		});
	});


	// TODO: Inquire for ones that won't match
	describe("inquireDevice()", function() {
		it("should return a device byte array", async function() {
			const message = await launchpad.inquireDevice();
			viewEvent(message);

			expect(
				await ask("Does your device match the response to the device inquiry?")
			).to.be.true;
		});
	});


	describe("inquireVersion()", function() {
		it("should return a version byte array", async function() {
			const message = await launchpad.inquireVersion();
			viewEvent(message);

			expect(
				await ask("Does your version match the response to the version inquiry?")
			).to.be.true;
		});
	});
});
// TODO
// reset
// setToBootloader
// deviceId
// get buttons
// buttons
// open
// close
// changeLayout
// resetLayout
