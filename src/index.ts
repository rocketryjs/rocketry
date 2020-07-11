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
	midi: new Proxy({}, {get(target: object, property: string) {throw Error(`No MIDI plugin is registered with Rocketry and property: ${property} was attempted to be retrieved.`)}}) as MidiLayerAPI,
	// Opened device instances TODO: remove as the need for registering the next device may be removed if you have to construct from the device plugin
	opened: new Map(),
};


/*
	Export Rocketry
*/
// Default export
// TODO: compile default export from methods to fix the issue with destructuring
export default rocketry;
// Destructured
// Properties accessed on `rocketry` from exported methods must also be exported
export const {registerMidiLayer, registerDevice, devices} = rocketry;
// Sub-modules
export {default as Device} from "./device";
