/*
	Tests for the Launchpad (launchpad) module

	Tested:
		constructor
		TODO
			open
			close
			receive
			getConfig
			hasConfig
			setColor
			light
			lightAll
			dark
			darkAll
			scrollText
			stopScrollText
			normalizeColor
			normalizeText
			events*
			isLaunchpad
	Faked:
		result of newInput
		result of newOutput
	Stubbed:
		(input|output)
			getPortCount
			getPortName
		_core
			getFirstLaunchpad
			newInput
			newOutput
	Spied:
		TODO
			(input|output)
				openPort
				closePort
			ouput
				on
			_core
				send
*/


/*
	Module dependencies
*/
const expect = require("chai").expect;
const sinon = require("sinon");
const proxyquire = require("proxyquire");


describe("launchpad", () => {
	let Launchpad;
	let coreStub;

	before(() => {
		coreStub =  {
			"newInput": function() {
				const data = {};

				// Internal type
				data.is = "input";

				// Input devices as seen on my system
				data.getPortCount = sinon.stub();
				data.getPortCount.returns(1);
				data.getPortName = sinon.stub();
				data.getPortName.returns("3- Launchpad MK2 0");

				// Open / Close port
				data.openPort = sinon.spy();
				data.closePort = sinon.spy();

				// Event Mock
				data.on = sinon.spy();

				return data;
			},
			"newOutput": function() {
				const data = {};

				// Internal type
				data.is = "output";

				// Output devices as seen on my system
				data.getPortCount = sinon.stub();
				data.getPortCount.returns(2);
				data.getPortName = sinon.stub();
				data.getPortName.returns("3- Launchpad MK2 1");

				// Open / Close port
				data.openPort = sinon.spy();
				data.closePort = sinon.spy();

				return data;
			},
			"getFirstLaunchpad": function(port) {
				if (port.is === "input") {
					return 0;
				} else if (port.is === "output") {
					return 1;
				}
			},
			"@noCallThru": true
		};

		Launchpad = proxyquire("../lib/device/launchpad.js", {
			"../core.js": coreStub
		});
	});

	describe("constructor", () => {
		context("when ports are passed as two numbers", () => {
			it("should use supplied ports", () => {
				const launchpad = new Launchpad(0, 1);
				expect(
					launchpad.port
				).to.deep.equal(
					{
						"input": 0,
						"output": 1
					}
				);
			});
		});
		context("when ports are passed as a single number", () => {
			it("should use supplied port for both ports", () => {
				const launchpad = new Launchpad(1);
				expect(
					launchpad.port
				).to.deep.equal(
					{
						"input": 1,
						"output": 1
					}
				);
			});
		});
		context("when ports are passed as an array", () => {
			it("should use supplied ports", () => {
				const launchpad = new Launchpad([0, 1]);
				expect(
					launchpad.port
				).to.deep.equal(
					{
						"input": 0,
						"output": 1
					}
				);
			});
		});
		context("when ports are passed as an object", () => {
			it("should use supplied ports", () => {
				const launchpad = new Launchpad({
					"input": 0,
					"output": 1
				});
				expect(
					launchpad.port
				).to.deep.equal(
					{
						"input": 0,
						"output": 1
					}
				);
			});
		});
		context("when no ports are passed", () => {
			it("should get the first supported device", () => {
				const launchpad = new Launchpad();
				expect(
					launchpad.port
				).to.deep.equal(
					{
						"input": 0,
						"output": 1
					}
				);
			});
		});
		it("lastInstance should be the last launchpad", () => {
			const launchpad = new Launchpad();
			expect(
				Launchpad.lastInstance
			).to.equal(
				launchpad
			);
		});
		it("should return a launchpad", () => {
			const launchpad = new Launchpad();
			expect(
				Launchpad.isLaunchpad(launchpad)
			).to.be.true;
		});
	});
});
