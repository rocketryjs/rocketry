/*
	Module: Rocketry
	Description: Assembly of the individual modules, methods for constructing devices
*/
import {MIDILayerAPIClass, DeviceAPI} from "./types";

export interface RocketryType {
	registerMIDILayer<T extends MIDILayerAPIClass>(midiLayer: T): void;
	registerDevice(device: DeviceAPI): void;
	midi?: MIDILayerAPIClass;
	devices: {[index: string]: DeviceAPI};
}
export const rocketry: RocketryType = {
	registerMIDILayer(midiLayer) {
		this.midi = midiLayer;
	},
	registerDevice(device) {
		this.devices[device.type] = device;
	},
	// Device classes
	devices: {},
};
