/*
	Module: Launchpad inquiry mixin
	Description: Methods, properties, and events for device ID, device, version inquiry and setting to bootloader
*/
/*
	Module dependencies
*/
// lodash
const _ = require("lodash");
// Core
const core = require("../../core.js");
// Mixin
const {methods, properties} = require("../../mixin.js");


module.exports = function() {
	// Events
	// Add destination
	if (typeof this.events !== "object") {
		this.events = {};
	}

	// Shared functions
	const makeVersion = function(value) {
		return parseInt(value.join(""));
	};
	const makeSize = function(value) {
		return value.join(".") + " KB";
	};

	// Shared bytes
	const sysExStatus = {
		"matches": [240],
		mutate(message) {
			message.status = message.status[0];
		}
	};
	const sysExFooter = {
		"matches": [247],
		mutate(message) {
			message.footer = message.footer[0];
		}
	};
	const manufacturerId = {
		"matches": this.sysExManufacturerId
	};
	const bootloaderVersion = {
		"min": 5,
		"max": 5,
		mutate(message) {
			message["bootloader version"] = makeVersion(message["bootloader version"]);
		}
	};
	const firmwareVersion = {
		"min": 5,
		"max": 5,
		mutate(message) {
			message["firmware version"] = makeVersion(message["firmware version"]);
		}
	};
	const bootloaderSize = {
		"min": 2,
		"max": Infinity,
		mutate(message) {
			message["bootloader size"] = makeSize(message["bootloader size"]);
		}
	};

	Object.assign(this.events, {
		// Response from device inquiry
		"device": {
			"status": sysExStatus,
			"system common": {
				"matches": [126],
				mutate(message) {
					message["system common"] = message["system common"][0];
				}
			},
			"device id": {
				"min": 1,
				"max": 1,
				validate(value) {
					return _.inRange(value, 0, 16);
				},
				mutate(message) {
					message["device id"] = message["device id"][0];
				}
			},
			"method response": {
				"matches": [6, 2]
			},
			"manufacturer id": manufacturerId,
			"device information": {
				"min": 3,
				"max": 3
			},
			"firmware version": firmwareVersion,
			"footer": sysExFooter
		},
		// Response from version inquiry
		"version": {
			"status": sysExStatus,
			"manufacturer id": manufacturerId,
			"method response": {
				"matches": [0, 112]
			},
			"bootloader version": bootloaderVersion,
			"firmware version": firmwareVersion,
			"bootloader size": bootloaderSize,
			"footer": sysExFooter
		}
	});


	// Methods
	methods(
		// Object to mix into
		this,

		// Instance
		{
			// Force the Launchpad into bootloader mode
			setToBootloader() {
				// Send with default manufacturer ID using undefined and empty the model ID using []
				return this.sendSysEx([0, 113, 0, 105], undefined, []);
			},
			// Sends device inquiry and returns the result in promise form
			deviceInquiry(deviceId = this.deviceId) {
				// The IDs are zero indexed in this case (0 - 15 inclusive)
				// 127 can be used to have all respond regardless of ID
				if (!_.inRange(deviceId, 0, 16) && deviceId !== 127) {
					throw new RangeError(`Device ID ${deviceId} is not between 0 and 15 or 127.`);
				}

				// Send with empty manufacturer ID and model ID
				this.sendSysCom([126, deviceId, 6, 1]);

				// Promise returns information about the connected device
				return this.promiseOnce("device");
			},
			// Sends version inquiry and returns the result in promise form
			versionInquiry() {
				// Send with default manufacturer ID using undefined and empty the model ID using []
				this.sendSysEx([0, 112], undefined, []);

				// Promise returns the current bootloader and firmware versions and size of bootloader in KB
				return this.promiseOnce("version");
			},
		}
	);


	// Properties, return object
	return properties(
		// Object to mix into
		this,

		// Instance
		{
			// Device id (1 - 16, set in bootloader, subtracting 1 for zero indexing)
			"deviceId": {
				// Smart setter
				set(value) {
					delete this.deviceId;
					this.deviceId = value;
				},
				get() {
					const deviceName = core.getDeviceName(
						this.input,
						this.output,
						this.portNums.input,
						this.portNums.output
					);
					const match = deviceName.match(/^(?:(\d+)-?\s+)?.*?(?:\s+(\d+))?$/);
					if (match && match[1]) {
						// Example: "6- Launchpad MK2" means the device ID is 0 (1)
						return 0;
					} else if (match && match[2]) {
						// Example: "Launchpad MK2 5" means the device ID is 4 (5)
						return parseInt(match[2]) - 1;
					} else {
						// Can't find value in device name, default to 0 (1)
						return 0;
					}
				}
			}
		},

		// Static
		{
			// Device name mutation and matching regex
			"regex": {
				get() {
					return `^(?:\\d+-?\\s+)?(${this.name})(?:\\s+\\d+)?$`;
				}
			}
		}
	);
};
