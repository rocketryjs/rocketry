/*
	Module: Index - Rocket
	Description: Assembly of the individual modules
*/
/*
	Sub-modules
*/
const core = require("./core.js");
const {devices, support} = require("./support.js");
const newDevice = require("./new.js");


/*
	Devices
*/
const LaunchpadMk2 = require("./launchpad/launchpad-mk2.js");


const rocket = Object.assign(
	newDevice,
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
	.add(LaunchpadMk2.type, LaunchpadMk2)
);


module.exports = rocket;
