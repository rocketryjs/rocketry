/*
	Tests for the _core (core) module

	Tested:
		newInput
		newOutput
		getFirstLaunchpad
		send
	Faked:
		launchpad (launchpadFake)
	Stubbed:
		MIDI.input, MIDI.output
			getPortCount
			getPortName
	Spied:
		MIDI.output.sendMessage
*/


// Allow for functions to be made in objects without shorthand, allow undefined (for describe, before, it, expect, etc.), allow for devDeps to be used for testing
/* eslint-disable object-shorthand, no-undef, node/no-unpublished-require */


/*
	Module dependencies
*/
const expect = require("chai").expect;
const sinon = require("sinon");
const proxyquire = require("proxyquire");


describe("_core", () => {
	let _core;
	let midiStub;
	let launchpadFake;

	before(() => {
		midiStub =  {
			"input": function() {
				// Input devices as seen on my system
				this.getPortCount = sinon.stub();
				this.getPortCount.returns(1);
				this.getPortName = sinon.stub();
				this.getPortName.withArgs(0).returns("3- Launchpad MK2 0");
			},
			"output": function() {
				// Output devices as seen on my system
				this.getPortCount = sinon.stub();
				this.getPortCount.returns(2);
				this.getPortName = sinon.stub();
				this.getPortName.withArgs(0).returns("Microsoft GS Wavetable Synth 0");
				this.getPortName.withArgs(1).returns("3- Launchpad MK2 1");

				// Message spy
				this.sendMessage = sinon.spy();
			},
			"@noCallThru": true
		};

		_core = proxyquire("../src/core.js", {
			"midi": midiStub
		});

		launchpadFake = {
			"device": "Launchpad MK2",
			"input": new midiStub.input(),
			"output": new midiStub.output(),
			"port": {
				"in": 0,
				"out": 1
			}
		};
	});

	describe("newInput", () => {
		it("should get a midi input", () => {
			expect(
				_core.newInput()
			).to.be.an.instanceof(
				midiStub.input
			);
		});
	});
	describe("newOutput", () => {
		it("should get a midi output", () => {
			expect(
				_core.newOutput()
			).to.be.an.instanceof(
				midiStub.output
			);
		});
	});
	describe("getFirstLaunchpad", () => {
		context("when getting input", () => {
			it("should get a midi input port matching the first supported device", () => {
				expect(
					_core.getFirstLaunchpad(_core.newInput())
				).to.equal(
					0
				);
			});
		});
		context("when getting output", () => {
			it("should get a midi output port matching the first supported device", () => {
				expect(
					_core.getFirstLaunchpad(_core.newOutput())
				).to.equal(
					1
				);
			});
		});
	});
	describe("send", () => {
		// Errors
		context("when no launchpad is present", () => {
			it("should throw error", () => {
				expect(() => {
					_core.send("light", {"header": 144, "led": 11, "color": 57});
				}).to.throw();
			});
		});
		context("when no command is present", () => {
			it("should throw error", () => {
				expect(() => {
					_core.send(null, {"header": 144, "led": 11, "color": 57}, launchpadFake);
				}).to.throw();
			});
		});
		context("when no argument object is present", () => {
			it("should throw error", () => {
				expect(() => {
					_core.send("light", null, launchpadFake);
				}).to.throw();
			});
		});
		context("when argument is missing", () => {
			it("should throw error", () => {
				expect(() => {
					_core.send("light", {"header": 144, "color": 57}, launchpadFake);
				}).to.throw();
			});
		});
		// Working calls
		context("when lighting", () => {
			it("should output an array from template", () => {
				launchpadFake.output.sendMessage.reset();
				_core.send("light", {"header": 144, "led": 11, "color": 57}, launchpadFake);
				expect(
					launchpadFake.output.sendMessage.withArgs([144, 11, 57]).calledOnce
				).to.be.true;
			});
		});
		context("when lighting with rgb", () => {
			it("should output an array from template", () => {
				launchpadFake.output.sendMessage.reset();
				_core.send("light rgb", {"led": 11, "color": [10, 20, 30]}, launchpadFake);
				expect(
					launchpadFake.output.sendMessage.withArgs([240, 0, 32, 41, 2, 24, 10, 11, 10, 20, 30, 247]).calledOnce
				).to.be.true;
			});
		});
		context("when lighting column", () => {
			it("should output an array from template", () => {
				launchpadFake.output.sendMessage.reset();
				_core.send("light column", {"column": 1, "color": 57}, launchpadFake);
				expect(
					launchpadFake.output.sendMessage.withArgs([240, 0, 32, 41, 2, 24, 12, 1, 57, 247]).calledOnce
				).to.be.true;
			});
		});
		context("when lighting row", () => {
			it("should output an array from template", () => {
				launchpadFake.output.sendMessage.reset();
				_core.send("light row", {"row": 1, "color": 57}, launchpadFake);
				expect(
					launchpadFake.output.sendMessage.withArgs([240, 0, 32, 41, 2, 24, 13, 1, 57, 247]).calledOnce
				).to.be.true;
			});
		});
		context("when lighting all", () => {
			it("should output an array from template", () => {
				launchpadFake.output.sendMessage.reset();
				_core.send("light all", {"color": 57}, launchpadFake);
				expect(
					launchpadFake.output.sendMessage.withArgs([240, 0, 32, 41, 2, 24, 14, 57, 247]).calledOnce
				).to.be.true;
			});
		});
		context("when flashing", () => {
			it("should output an array from template", () => {
				launchpadFake.output.sendMessage.reset();
				_core.send("flash", {"header": 144, "led": 11, "color": 57}, launchpadFake);
				expect(
					launchpadFake.output.sendMessage.withArgs([240, 0, 32, 41, 2, 24, 35, 0, 11, 57, 247]).calledOnce
				).to.be.true;
			});
		});
		context("when pulsing", () => {
			it("should output an array from template", () => {
				launchpadFake.output.sendMessage.reset();
				_core.send("pulse", {"header": 144, "led": 11, "color": 57}, launchpadFake);
				expect(
					launchpadFake.output.sendMessage.withArgs([240, 0, 32, 41, 2, 24, 40, 0, 11, 57, 247]).calledOnce
				).to.be.true;
			});
		});
		context("when scrolling text with loop", () => {
			it("should output an array from template", () => {
				launchpadFake.output.sendMessage.reset();
				_core.send("scroll text", {"header": 144, "led": 11, "color": 57, "loop": 1, "text": [1, 84, 101, 7, 115, 116]}, launchpadFake);
				expect(
					launchpadFake.output.sendMessage.withArgs([240, 0, 32, 41, 2, 24, 20, 57, 1, 1, 84, 101, 7, 115, 116, 247]).calledOnce
				).to.be.true;
			});
		});
		context("when scrolling text without loop", () => {
			it("should output an array from template", () => {
				launchpadFake.output.sendMessage.reset();
				_core.send("scroll text", {"header": 144, "led": 11, "color": 57, "loop": 0, "text": [1, 84, 101, 7, 115, 116]}, launchpadFake);
				expect(
					launchpadFake.output.sendMessage.withArgs([240, 0, 32, 41, 2, 24, 20, 57, 0, 1, 84, 101, 7, 115, 116, 247]).calledOnce
				).to.be.true;
			});
		});
		context("when custom command with args", () => {
			it("should output an array from template", () => {
				launchpadFake.output.sendMessage.reset();
				_core.send([240, 0, 32, 41, 2, 24, 20, 57, 0, 1, 84, 101, 7, 115, 116, 247], {}, launchpadFake);
				expect(
					launchpadFake.output.sendMessage.withArgs([240, 0, 32, 41, 2, 24, 20, 57, 0, 1, 84, 101, 7, 115, 116, 247]).calledOnce
				).to.be.true;
			});
		});
		context("when custom command without args", () => {
			it("should output an array from template", () => {
				launchpadFake.output.sendMessage.reset();
				_core.send([240, 0, 32, 41, 2, 24, 20, 57, 0, 1, 84, 101, 7, 115, "test", 247], {"test": [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]}, launchpadFake);
				expect(
					launchpadFake.output.sendMessage.withArgs([240, 0, 32, 41, 2, 24, 20, 57, 0, 1, 84, 101, 7, 115, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 247]).calledOnce
				).to.be.true;
			});
		});
		// Method chaining
		it("should return the launchpad", () => {
			expect(
				_core.send("light", {"header": 144, "led": 11, "color": 57}, launchpadFake)
			).to.equal(
				launchpadFake
			);
		});
	});
});
