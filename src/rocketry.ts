/*
	Module: Rocketry
	Description: Assembly of the individual modules, methods for constructing devices
*/
import type {MIDILayerAPIClass, DeviceAPIClass} from "./types";


export interface RocketryType {
	midi?: RegisteredMIDILayer;
	devices: RegisteredDevices;
	registerMIDILayer<T extends MIDILayerAPIClass>(midiLayer: T): void;
	registerDevice<T extends DeviceAPIClass>(device: T): void;
}
// Merge your MIDI layer class or methods into this interface to add static types
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RegisteredMIDILayer extends MIDILayerAPIClass {}
// Merge your device class into this interface to add static types
export interface RegisteredDevices {
	[index: string]: DeviceAPIClass;
}

export const rocketry: RocketryType = {
	registerMIDILayer (midiLayer) {
		this.midi = midiLayer;
	},
	registerDevice (device) {
		this.devices[device.name] = device;
	},
	// Device classes
	devices: {} as RegisteredDevices, // Empty object, device modules will self-register
};
