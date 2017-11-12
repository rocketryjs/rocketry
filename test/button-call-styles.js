const rocket = require("../src/index.js");
new rocket.Launchpad();

//
const myButton = (
	new rocket.Button(0, 0)
		.setColor(0)
);
console.log(myButton);
