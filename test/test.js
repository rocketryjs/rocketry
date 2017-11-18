/*
	Module dependencies
*/
const rocket = require("../src/index.js");
const _ = require("lodash");


(function send() {
	// Launchpad facade
	const launchpad = {
		"device": "Launchpad MK2",
		"output": {
			"sendMessage": (message) => {
				launchpad.output.message = message;
			}
		}
	};

	const checks = {
		"command, no launchpad": {
			"command": ["light", {"header": 144, "led": 11, "color": 57}],
			"error": true
		},
		"light": {
			"command": ["light", {"header": 144, "led": 11, "color": 57}, launchpad],
			"response": [144, 11, 57]
		},
		"light rgb, extra header": {
			"command": ["light rgb", {"header": 144, "led": 11, "color": [10, 20, 30]}, launchpad],
			"response": [240, 0, 32, 41, 2, 24, 10, 11, 10, 20, 30, 247]
		},
		"light rgb, no header": {
			"command": ["light rgb", {"led": 11, "color": [10, 20, 30]}, launchpad],
			"response": [240, 0, 32, 41, 2, 24, 10, 11, 10, 20, 30, 247]
		},
		"light column": {
			"command": ["light column", {"column": 1, "color": 57}, launchpad],
			"response": [240, 0, 32, 41, 2, 24, 12, 1, 57, 247]
		},
		"light row": {
			"command": ["light row", {"row": 1, "color": 57}, launchpad],
			"response": [240, 0, 32, 41, 2, 24, 13, 1, 57, 247]
		},
		"light all": {
			"command": ["light all", {"color": 57}, launchpad],
			"response": [240, 0, 32, 41, 2, 24, 14, 57, 247]
		},
		"flash, extra header": {
			"command": ["flash", {"header": 144, "led": 11, "color": 57}, launchpad],
			"response": [240, 0, 32, 41, 2, 24, 35, 0, 11, 57, 247]
		},
		"pulse, extra header": {
			"command": ["pulse", {"header": 144, "led": 11, "color": 57}, launchpad],
			"response": [240, 0, 32, 41, 2, 24, 40, 0, 11, 57, 247]
		},
		"scroll text, loop, extra header": {
			"command": ["scroll text", {"header": 144, "led": 11, "color": 57, "loop": 1, "text": [1, 84, 101, 7, 115, 116]}, launchpad],
			"response": [240, 0, 32, 41, 2, 24, 20, 57, 1, 1, 84, 101, 7, 115, 116, 247]
		},
		"scroll text, no loop, extra header": {
			"command": ["scroll text", {"header": 144, "led": 11, "color": 57, "loop": 0, "text": [1, 84, 101, 7, 115, 116]}, launchpad],
			"response": [240, 0, 32, 41, 2, 24, 20, 57, 0, 1, 84, 101, 7, 115, 116, 247]
		},
		"custom command, args": {
			"command": [[240, 0, 32, 41, 2, 24, 20, 57, 0, 1, 84, 101, 7, 115, 116, 247], {}, launchpad],
			"response": [240, 0, 32, 41, 2, 24, 20, 57, 0, 1, 84, 101, 7, 115, 116, 247]
		},
		"custom command, no args": {
			"command": [[240, 0, 32, 41, 2, 24, 20, 57, 0, 1, 84, 101, 7, 115, "test", 247], {"test": [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]}, launchpad],
			"response": [240, 0, 32, 41, 2, 24, 20, 57, 0, 1, 84, 101, 7, 115, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 247]
		}
	};

	for (const check in checks) {
		try {
			rocket._core.send(...checks[check].command);
		} catch (error) {
			if (checks[check].error) {
				continue;
			} else {
				throw new Error(`send command "${check}" errored out with error "${error.toString()}"`);
			}
		}
		if (!_.isEqual(launchpad.output.message, checks[check].response) && !checks[check].error) {
			throw new Error(`send command "${check}" failed to match the response. Call: ${launchpad.output.message} Response: ${checks[check].response}`);
		}
	}
})();
