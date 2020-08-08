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
};


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
};
export interface MIDIOptions {
	sysex: boolean;
	[key: string]: unknown;
}
export interface MIDILayerAPI {
	options: MIDIOptions;
	send(message: Array<number>): void;
	connect(portNums: PortNumbers): void;
	disconnect(): void;
	getAllPortNumbers(regex?: RegExp): {input: Array<DevicePort>, output: Array<DevicePort>};
}
export interface MIDILayerAPIClass {
	new (options?: Partial<MIDIOptions>): MIDILayerAPI;
}

/*
	Device
*/
export interface DeviceAPIClass<D extends Device = Device> {
	new (ports?: PortNumbers): D;
	regex?: RegExp;
}
