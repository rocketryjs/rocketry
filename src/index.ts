/*
	Module: Index - Rocketry
	Description: Assembly of the individual modules, methods for constructing devices
*/
import {RocketryType, MidiLayerAPI, DeviceAPI} from "./types";


const rocketry: RocketryType = {
	registerMidiLayer(this: RocketryType, midiLayer: MidiLayerAPI) {
		this.midi = midiLayer;
	},
	registerDevice(this: RocketryType, device: DeviceAPI) {
		this.devices[device.type] = device;
	},
	// Device classes
	devices: {},
	// MIDI layer (default to throwing errors on access)
	midi: new Proxy({}, {get(target: object, property: string) {throw Error(`No MIDI plugin is registered with Rocketry and property: ${property} was attempted to be retrived.`)}}) as MidiLayerAPI,
	// Opened device instances TODO: remove as the need for registering the next device may be removed if you have to construct from the device plugin
	opened: new Map(),
	// Get all type names, or regex strings that get a type
	get regex() {
		const types = [];
		for (const key in this.devices) {
			if (this.devices[key].regex) {
				types.push(this.devices[key].regex);
			} else {
				types.push(this.devices[key].type);
			}
		}

		// Generate and return regex from above
		return new RegExp(`^(?:${types.join(")|(?:")})$`, "i");
	},
};


/*
	Export Rocketry
*/
// Default export
export default rocketry;
// Destructured
export const {registerMidiLayer, registerDevice} = rocketry;
// Sub-modules
export {default as Device} from "./device";
