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
// Manual test helpers
const {ask, device, setup, reset} = require("../helper/helper.js");


describe("Launchpad MK2", function() {
	before("setup test", setup(this).for.device("Launchpad MK2"));
	after("reset Launchpad", reset(this));


	describe("light()", function() {
		beforeEach("reset color", function() {
			device.dark();
		});

		context("when lighting green using a named color", function() {
			it("should light all buttons green", async function() {
				device.light("green");

				expect(
					await ask("Are all buttons lit green?")
				).to.be.true;
			});
		});

		context("when lighting green using a standard color", function() {
			it("should light all buttons green", async function() {
				device.light(23);

				expect(
					await ask("Are all buttons lit green?")
				).to.be.true;
			});
		});

		context("when lighting green using an RGB color", function() {
			it("should light all buttons green", async function() {
				device.light({
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
				device.light("red");
				device.dark();

				expect(
					await ask("Are all buttons dark and not red?")
				).to.be.true;
			});
		});

		context("when previously flashing red", function() {
			it("should dark all buttons", async function() {
				device.flash("red");
				device.dark();

				expect(
					await ask("Are all buttons dark and not flashing red?")
				).to.be.true;
			});
		});

		context("when previously pulsing red", function() {
			it("should dark all buttons", async function() {
				device.pulse("red");
				device.dark();

				expect(
					await ask("Are all buttons dark and not pulsing red?")
				).to.be.true;
			});
		});

		context("when darking while looping text scrolling", function() {
			it("should still be scrolling", async function() {
				device.light("red");
				device.scrollText("green", "PASS", true);
				device.dark();

				expect(
					await ask("Is text scrolling \"PASS\" in green?")
				).to.be.true;
			});

			it("should dark all buttons after scrolling", async function() {
				device.scrollText("red", "FAIL", true);
				device.stopScrollText();

				expect(
					await ask("Are all buttons dark and not text scrolling \"FAIL\" in red?")
				).to.be.true;
			});
		});
	});


	describe("flash()", function() {
		beforeEach("reset color", function() {
			device.dark();
		});

		context("when previously dark", function() {
			it("should flash all buttons", async function() {
				device.flash("green");

				expect(
					await ask("Are all buttons flashing green?")
				).to.be.true;
			});
		});

		context("when previously lit light green", function() {
			it("should flash all buttons", async function() {
				device.light("light green");
				device.flash("green");

				expect(
					await ask("Are all buttons flashing between green and light green?")
				).to.be.true;
			});
		});

		context("when previously flashing red", function() {
			it("should flash all buttons", async function() {
				device.flash("red");
				device.flash("green");

				expect(
					await ask("Are all buttons flashing green?")
				).to.be.true;
			});
		});

		context("when previously pulsing light green", function() {
			it("should flash all buttons", async function() {
				device.pulse("light green");
				device.flash("green");

				expect(
					await ask("Are all buttons flashing green and pulsing (may look solid) light green?")
				).to.be.true;
			});
		});
	});


	describe("stopFlash()", function() {
		beforeEach("reset color", function() {
			device.dark();
		});

		context("when previously dark and flashing red", function() {
			it("should stop flashing buttons", async function() {
				device.flash("red");
				device.stopFlash();

				expect(
					await ask("Are all buttons dark and not flashing red?")
				).to.be.true;
			});
		});

		context("when previously lit green and flashing red", function() {
			it("should stop flashing buttons", async function() {
				device.light("green");
				device.flash("red");
				device.stopFlash();

				expect(
					await ask("Are all buttons lit green and not flashing red?")
				).to.be.true;
			});
		});

		context("when previously pulsing green", function() {
			it("should stop flashing buttons", async function() {
				device.pulse("green");
				device.flash("red");
				device.stopFlash();

				expect(
					await ask("Are all buttons pulsing green?")
				).to.be.true;
			});
		});
	});


	describe("stopPulse()", function() {
		beforeEach("reset color", function() {
			device.dark();
		});

		context("when previously dark and pulsing red", function() {
			it("should stop pulsing buttons", async function() {
				device.pulse("red");
				device.stopPulse();

				expect(
					await ask("Are all buttons dark and not pulsing red?")
				).to.be.true;
			});
		});

		context("when previously lit red and flashing red", function() {
			it("should stop pulsing buttons", async function() {
				device.light("red");
				device.pulse("red");
				device.stopPulse();

				expect(
					await ask("Are all buttons dark and not lit or pulsing red?")
				).to.be.true;
			});
		});
	});


	describe("changeMidiClock()", function() {
		before("flash single button yellow", function() {
			device.buttons[0].flash("yellow");
		});
		beforeEach("reset MIDI clock", function() {
			device.resetMidiClock();
		});
		after("stop flashing, reset MIDI clock", function() {
			device.buttons[0].stopFlash();
			device.resetMidiClock();
		});

		context("when changing the timing to 40 BPM", function() {
			it("should flash very slowly", async function() {
				device.changeMidiClock(40);

				expect(
					await ask("Is a button flashing yellow at around 40 BPM (the minimum supported rate)?")
				).to.be.true;
			});
		});

		context("when changing the timing to 240 BPM", function() {
			it("should flash very quickly", async function() {
				device.changeMidiClock(240);

				expect(
					await ask("Is a button flashing yellow at around 240 BPM (the maximum supported rate)?")
				).to.be.true;
			});
		});
	});


	describe("resetMidiClock()", function() {
		before("flash single button yellow", function() {
			device.buttons[0].flash("yellow");
		});
		after("stop flashing, reset MIDI clock", function() {
			device.buttons[0].stopFlash();
		});

		context("when resetting timing", function() {
			it("should flash at a normal rate", async function() {
				device.resetMidiClock();

				expect(
					await ask("Is a button flashing yellow at around 120 BPM (the normal rate)?")
				).to.be.true;
			});
		});
	});


	describe("scrollText()", function() {
		afterEach("stop scrolling text", function() {
			device.stopScrollText();
		});

		context("when loop flag is on", function() {
			it("should scroll text indefinitely", async function() {
				device.scrollText("yellow", "LOOP", true);

				expect(
					await ask("Is text scrolling \"LOOP\" in yellow in a loop?")
				).to.be.true;
			});
		});

		context("when loop flag is off", function() {
			it("should scroll text once", async function() {
				device.scrollText("yellow", "ONCE", false);

				expect(
					await ask("Did text scrolling \"ONCE\" in yellow happen once?")
				).to.be.true;
			});
		});

		context("when loop flag is omitted", function() {
			it("should scroll text once", async function() {
				device.scrollText("yellow", "ONCE");

				expect(
					await ask("Did text scrolling \"ONCE\" in yellow happen once?")
				).to.be.true;
			});
		});

		context("when the speed is set to 1 at the beginning", function() {
			it("should scroll slowly", async function() {
				device.scrollText("yellow", [1, "111"]);

				expect(
					await ask("Did text scrolling \"111\" in yellow happen slowly?")
				).to.be.true;
			});
		});

		context("when the speed is set to 4 at the beginning", function() {
			it("should scroll at a normal pase", async function() {
				device.scrollText("yellow", [4, "444"]);

				expect(
					await ask("Did text scrolling \"444\" in yellow happen at a normal pase?")
				).to.be.true;
			});
		});

		context("when the speed is set to 7 at the beginning", function() {
			it("should scroll quickly", async function() {
				device.scrollText("yellow", [7, "777"]);

				expect(
					await ask("Did text scrolling \"777\" in yellow happen quickly?")
				).to.be.true;
			});
		});

		context("when the speed is increased progressively", function() {
			it("should scroll progressively quicker", async function() {
				device.scrollText("yellow", [1, "111", 2, "222", 3, "333", 4, "444", 5, "555", 6, "666", 7, "777"]);

				expect(
					await ask("Did text scrolling \"111222333444555666777\" in yellow get progressively quicker?")
				).to.be.true;
			});
		});
	});


	describe("stopScrollText()", function() {
		before("light buttons green", function() {
			device.light("green");
		});
		after("dark buttons", function() {
			device.dark();
		});

		context("when stopping a loop immediately", function() {
			it("should stop scrolling text", async function() {
				device.scrollText("red", "FAIL", true);
				device.stopScrollText();

				expect(
					await ask("Did text scrolling \"FAIL\" in red stop immediately and show all buttons lit green?")
				).to.be.true;
			});
		});

		context("when stopping a single scroll immediately", function() {
			it("should stop scrolling text", async function() {
				device.scrollText("red", "FAIL", false);
				device.stopScrollText();

				expect(
					await ask("Did text scrolling \"FAIL\" in red stop immediately and show all buttons lit green?")
				).to.be.true;
			});
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
