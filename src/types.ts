import {Device} from "./device";


/*
	Send
*/
export type Channel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
export type Message = Array<number>;
export interface SendBasic<R extends Device, T extends Device | void = R> {
	(this: T, message: Message): R;
}
export interface SendHelper<R extends Device, T extends Device | void = R> {
	(this: T, message: Message, channel?: Channel): R;
}
export interface Send<Return extends Device, This extends Device | void = Return> extends SendBasic<Return, This> {
	noteOff: SendHelper<Return, This>;
	noteOn: SendHelper<Return, This>;
	polyKeyPressure: SendHelper<Return, This>;
	controlChange: SendHelper<Return, This>;
	programChange: SendHelper<Return, This>;
	monoKeyPressure: SendHelper<Return, This>;
	channelPressure: SendHelper<Return, This>;
	pitchBend: SendHelper<Return, This>;
	// SysEx Aliases
	systemExclusive: SendBasic<Return, This>;
	sysEx: SendBasic<Return, This>;
	sysex: SendBasic<Return, This>;
}


/*
	MIDI
*/
export interface PortNumbers {
	input: number;
	output: number;
}
export interface DevicePort {
	name: string;
	number: number;
}
export interface DevicePorts {
	input: Array<DevicePort>;
	output: Array<DevicePort>;
}
export interface MIDIOptions {
	[key: string]: unknown;
	sysEx: boolean;
}
export interface MIDILayerAPI<O extends MIDIOptions = MIDIOptions> {
	options: O;
	send (message: Array<number>): void;
	connect (portNumbers: PortNumbers): void;
	disconnect (): void;
	getAllPortNumbers (regex?: RegExp): {input: Array<DevicePort>, output: Array<DevicePort>};
	addListeners (): void;
	removeListeners (): void;
}
export interface MIDILayerAPIClass<O extends MIDIOptions = MIDIOptions, R extends MIDILayerAPI = MIDILayerAPI<O>> {
	new (device: Device, options?: Partial<O>): R;
}

/*
	Device
*/
export interface State {
	min?: number;
	max?: number;
	matches?: Message;
	validate?(value: number): boolean;
	mutate?(message: any): any;
}
export interface States {
	[name: string]: State;
}
export interface SysEx {
	manufacturer: Message;
	model: Message;
	prefix: Message;
}
export interface DeviceAPIClass<D extends Device = Device> {
	regex: RegExp;
	sysex: SysEx;
	events?: Map<string, States>;
	new (ports?: PortNumbers): D;
}
