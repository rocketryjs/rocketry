/*
	Sub-modules
*/
const core = require("./core.js");
const support = require("./support.js");
const send = require("./send.js");
const types = require("./types.js");


/*
	Devices
*/
const Mk2 = require("./device/launchpad-mk2.js");


const rocket = Object.assign(
	require("./new.js"),
	{
		types,
		core,
		support,
		send
	}
);


/*
	Add device support
*/
(rocket.support
	.add(Mk2.name, Mk2)
);


module.exports = rocket;
