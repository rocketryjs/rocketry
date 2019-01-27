/*
	Manual integration tests for the inquiry mixin

	Tested - functions that are tested fully or partially in this document - found in `describe()`
*/


/*
	Module dependencies
*/
// Assertion library
const expect = require("chai").expect;
// Manual test helpers
const {ask, device, setup, reset, logEvent} = require("../../helper/helper.js");


describe("inquiry", function() {
	before("setup test", setup(this).for.device.mixin("inquiry"));
	after("reset Launchpad", reset(this));


	// TODO: Inquire for ones that won't match
	describe("inquireDevice()", function() {
		it("should return a device byte array", async function() {
			const message = await device.inquireDevice();
			logEvent(message);

			expect(
				await ask("Does your device match the response to the device inquiry?")
			).to.be.true;
		});
	});


	describe("inquireVersion()", function() {
		it("should return a version byte array", async function() {
			const message = await device.inquireVersion();
			logEvent(message);

			expect(
				await ask("Does your version match the response to the version inquiry?")
			).to.be.true;
		});
	});
});
