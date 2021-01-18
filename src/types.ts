import {Device} from "./device";


/*
	Send
*/
export type Channel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
export type Message = Array<number>;
export type Status = "noteOff" | "noteOn" | "polyKeyPressure" | "controlChange" | "programChange" | "monoKeyPressure" | "channelPressure" | "pitchBend" | "systemExclusive" | "sysEx" | "sysex";
export interface SendBasic<T extends Device<T> | void, R extends Device<R> | void = T> {
	(this: T, message: Message): R;
}
export interface SendHelper<T extends Device<T> | void, R extends Device<R> | void = T> {
	(this: T, message: Message, channel?: Channel): R;
}
export interface Send<T extends Device<T> | void, R extends Device<R> | void = T> extends SendBasic<T, R> {
	noteOff: SendHelper<T, R>;
	noteOn: SendHelper<T, R>;
	polyKeyPressure: SendHelper<T, R>;
	controlChange: SendHelper<T, R>;
	programChange: SendHelper<T, R>;
	monoKeyPressure: SendHelper<T, R>;
	channelPressure: SendHelper<T, R>;
	pitchBend: SendHelper<T, R>;
	// SysEx Aliases
	systemExclusive: SendBasic<T, R>;
	sysEx: SendBasic<T, R>;
	sysex: SendBasic<T, R>;
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
	new (listener: (deltaTime: number, message: Array<number>) => void, options?: Partial<O>): R;
}

/*
	Device
*/
export type Captures = Record<string, Array<number>>;
export type Meta = {
	[key: string]: unknown;
};
export type Validate = (match: Message, captures: Captures) => boolean;
export type GetMetaData = (message: Message, captures: Captures) => Meta;
export interface CaptureGroup {
	minBytes?: number;
	maxBytes?: number;
	matchBytes?: Message;
}
export type Pattern = Record<string, CaptureGroup>;
export interface EventDetails {
	pattern: Pattern;
	validate?: Validate;
	getMetaData?: GetMetaData;
}
export interface SysEx {
	manufacturer: Message;
	model: Message;
	prefix: Message;
}
export interface DeviceAPI {
	regex: RegExp;
	sysex: SysEx;
	events?: Map<string, EventDetails>;
}
export interface DeviceAPIClass<D extends Device<D>> extends DeviceAPI {
	new (ports?: PortNumbers): D;
}
