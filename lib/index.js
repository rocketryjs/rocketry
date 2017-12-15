/*
	Module: Index - Rocket
	Description: Assembly of the individual modules
*/
/*
	Sub-modules
*/
const core = require("./core.js");
const {devices, support} = require("./support.js");
const constructor = require("./new.js");


/*
	Devices
*/
const Mk2 = require("./device/launchpad/launchpad-mk2.js");


const rocket = Object.assign(
	constructor,
	{
		devices,
		core,
		support
	}
);


/*
	Add device support
*/
(rocket.support
	.add(Mk2.name, Mk2)
);


module.exports = rocket;
