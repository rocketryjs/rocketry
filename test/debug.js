const rocket = require("../src/index.js");
// lodash
// const _ = require("lodash");
const launchpad = (
	new rocket.Launchpad()
);

// const rgb = {
// 	"red": 10,
// 	"green": 20,
// 	"blue": 30
// };
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

button.on("press", function() {
	this.setColor("blue");
});
button.on("release", function() {
	this.dark();
});
new rocket.Button([7, 7], launchpad)
	.light("red")
	.on("press", function() {
		this.launchpad.dark();
		this.light("red");
	});
