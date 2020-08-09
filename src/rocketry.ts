/*
	Module: Rocketry
	Description: Assembly of the individual modules, methods for constructing devices
*/
import type {MIDILayerAPIClass, DeviceAPIClass} from "./types";

export interface RocketryType {
	registerMIDILayer<T extends MIDILayerAPIClass>(midiLayer: T): void;
	registerDevice<T extends DeviceAPIClass>(device: T): void;
	midi?: RegisteredMIDILayer;
	devices: RegisteredDevices;
}
// Merge your MIDI layer class or methods into this interface to add static types
export interface RegisteredMIDILayer extends MIDILayerAPIClass {}
// Merge your device class into this interface to add static types
export interface RegisteredDevices {
	[index: string]: DeviceAPIClass;
}

export const rocketry: RocketryType = {
	registerMIDILayer(midiLayer) {
		this.midi = midiLayer;
	},
	registerDevice(device) {
		this.devices[device.name] = device;
	},
	// Device classes
	devices: {} as RegisteredDevices, // Empty object, device modules will self-register
};