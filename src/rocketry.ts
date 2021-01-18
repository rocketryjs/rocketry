import type {MIDILayerAPIClass, DeviceAPIClass} from "./types";


export interface RocketryType {
	midi?: RegisteredMIDILayer;
	devices: RegisteredDevices;
	registerMIDILayer<T extends MIDILayerAPIClass>(midiLayer: T): void;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	registerDevice<T extends DeviceAPIClass<any>>(device: T): void;
}
// Merge your MIDI layer class or methods into this interface to add static types
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RegisteredMIDILayer extends MIDILayerAPIClass {}
// Merge your device class into this interface to add static types
export interface RegisteredDevices {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[index: string]: DeviceAPIClass<any>;
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
