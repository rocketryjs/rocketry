/*
	"I get intermittent errors if I close core's MIDI I/O for finding devices and if I don't close them, the process won't end when all others are closed. See: justinlatimer/node-midi#117" ~ Some commit description I made
*/


// Get MIDI I/O
// Gets a MIDI input
const newInput = function() {
	return new midi.input();
};
// Gets a MIDI output
const newOutput = function() {
	return new midi.output();
};

// Gets the first supported Launchpad's ports
const getFirstLaunchpad = function() {
	const channels = {
		"input": newInput(),
		"output": newOutput()
	};
	const port = {};
	const regex = support.deviceRegex;

	// For input and output
	for (const key in channels) {
		const numOfPorts = channels[key].getPortCount();
		// For all ports in input/output
		for (let i = 0; i < numOfPorts; i++) {
			if (channels[key].getPortName(i).match(regex)) {
				port[key] = i;
				break;
			}
		}

		// Close port
		channels[key].closePort();
	}

	return port;
};
