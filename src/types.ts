import {EventEmitter} from "events";
import {Device} from "./device";


/*
	Send
*/
export type Channel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
export type Message = Array<number>;
export interface SendBasicType<T extends DeviceInstaceAPI> {
	(this: T, message: Message): T;
}
export interface SendHelperType<T extends DeviceInstaceAPI> {
	(this: T, message: Message, channel?: Channel): T;
}
export interface SendType<T extends DeviceInstaceAPI> extends SendBasicType<T> {
	noteOff: SendHelperType<T>;
	noteOn: SendHelperType<T>;
	polyKeyPressure: SendHelperType<T>;
	controlChange: SendHelperType<T>;
	programChange: SendHelperType<T>;
	monoKeyPressure: SendHelperType<T>;
	channelPressure: SendHelperType<T>;
	pitchBend: SendHelperType<T>;
	systemExclusive: SendBasicType<T>;
	sysEx: SendBasicType<T>;
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
export interface DeviceAPI {
	(ports?: PortNumbers): Device;
	type: string;
	regex?: RegExp;
}
