const rocket = require("../src/index.js");
// lodash
// const _ = require("lodash");
const launchpad = (
	new rocket.Launchpad()
);
// rocket._core.send([240, 0, 32, 41, 2, 24, 20, 95, 0, 1, 97, 115, 100, 102, 7, 49, 50, 51, 52, 116, 101, 115, 116, 247], {}, launchpad);
// rocket._core.send("lol", {}, launchpad);
// rocket._core.send([[240, 0, 32, 41, 2, 24], [20, 57, 1, [72, 105]], 247], {}, launchpad);
// launchpad.output.sendMessage([240, 0, 32, 41, 2, 24, [35, 145, 11, 5], 247]);
const rgb = {
	"red": 10,
	"green": 20,
	"blue": 30
};
// const button = (
// 	new rocket.Button({
// 		"value": 11
// 	}, launchpad)
// 		.flash("pink")
// );
const button = (
	new rocket.Button([0, 0], [1, 2], launchpad)
		.setColor("blue grey")
);
// launchpad.scrollText("pink", [{
// 	"text": "asdf",
// 	"speed": 1
// }, {
// 	"text": "1234",
// 	"speed": 7
// }, "test"], true);

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
		launchpad.dark();
		// launchpad.output.sendMessage([message[0], message[1], 0]);
	}
});
