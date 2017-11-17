const rocket = require("../src/index.js");
// const EventEmitter = require("events");
// lodash
// const _ = require("lodash");
const launchpad = (
	new rocket.Launchpad()
);
// rocket._core.send([240, 0, 32, 41, 2, 24, [40, 0, 111, 0], 247], {}, launchpad);
// rocket._core.send([176, 111, 0], {}, launchpad);
// launchpad.output.sendMessage([240, 0, 32, 41, 2, 24, [35, 145, 11, 5], 247]);
const rgb = {
	"red": 40,
	"green": 40,
	"blue": 40
};
// const button = (
// 	new rocket.Button({
// 		"value": 11
// 	}, launchpad)
// 		.setColor(rgb)
// );
launchpad.output.sendMessage([ 240, 0, 32, 41, 2, 24, 10, 11, 40, 40, 40, 247 ])
// const button = (
// 	new rocket.Button([0, 0], [1, 2], launchpad)
// 		.setColor(rgb)
// );

// button.on("press", (...args) => {
// 	console.log(args);
// })

// for (const listener of button.listeners("press")) {
// 	button.emit("pressed", "test");
// }
// const testButton = (
// 	new rocket.Row(0, launchpad)
// 		.setColor(0)
// );
// console.log(testButton);





launchpad.input.on("message", function(deltaTime, message) {
	console.log(deltaTime, message)
	if (message[2] === 0) {
		// launchpad.output.sendMessage([message[0], message[1], 57]);
		// launchpad.output.sendMessage([message[0], message[1], 0]);
	} else {
		launchpad.output.sendMessage([240, 0, 32, 41, 2, 24, 14, 0, 247]);
		// launchpad.output.sendMessage([message[0], message[1], 0]);
	}
});
// launchpad.output.sendMessage([240, 0, 32, 41, 2, 24, 14, 36, 247]);
// launchpad.output.sendMessage([240, 0, 32, 41, 2, 24, 14, 0, 247]);
// launchpad.output.sendMessage([240, 0, 32, 41, 2, 24, 14, 0, 247]);
// [ 240, 32, 41, 2, 24, 13, 0, 95, 247 ]
