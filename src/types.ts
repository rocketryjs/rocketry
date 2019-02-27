import EventEmitter from "events";


/*
	Send
*/
export type ChannelType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
export type MessageType = Array<number>;
interface SendBasicType<T> {
	(this: T, message: MessageType): T;
}
interface SendHelperType<T> {
	(this: T, message: MessageType, channel?: ChannelType): T;
}
export interface SendType<T> extends SendBasicType<T> {
	noteoff: SendHelperType<T>;
	noteon: SendHelperType<T>;
	polykeypressure: SendHelperType<T>;
	controlchange: SendHelperType<T>;
	programchange: SendHelperType<T>;
	monokeypressure: SendHelperType<T>;
	channelpressure: SendHelperType<T>;
	pitchbend: SendHelperType<T>;
	systemexclusive: SendBasicType<T>;
	sysex: SendBasicType<T>;
};


/*
	MIDI
*/
export interface InputAPI {

}
export interface OutputAPI {

}
export interface PortsType {
	input: number;
	output: number;
}
export interface MidiLayerAPI {
	createMidiIO(): {input: InputAPI, output: OutputAPI};
	sysexEnabled?: boolean;
}

/*
	Device
*/
export interface DeviceInstaceAPI extends EventEmitter {
	open(): DeviceInstaceAPI;
	close(): DeviceInstaceAPI;
	receive(): DeviceInstaceAPI;
	promiseOnce(): DeviceInstaceAPI;
	input: InputAPI;
	output: OutputAPI;
	portNums: PortsType;
	send: SendType<DeviceInstaceAPI>;
}
export interface DeviceType {
	(ports?: PortsType): DeviceInstaceAPI;
}
export interface DeviceAPI extends DeviceType {
	type: string;
	regex?: RegExp;
}

/*
	Rocketry
*/
export interface RocketryType {
	registerMidiLayer(this: RocketryType, midiLayer: MidiLayerAPI): void;
	registerDevice(this: RocketryType, device: DeviceAPI): void;
	devices: {[index: string]: DeviceAPI};
	midi: MidiLayerAPI;
	opened: Map<TODO>;
	regex: RegExp;
}
