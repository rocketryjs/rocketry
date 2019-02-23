/*
	Module: Send
	Description: Methods to send arrays of MIDI bytes
*/
import {betweenInclusive} from "./util";


type ChannelType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
type MessageType = Array<number>;

interface SendBasicType<T> {
	(this: T, message: MessageType): T;
}
interface SendHelperType<T> {
	(this: T, message: MessageType, channel?: ChannelType): T;
}
interface SendType<T> extends SendBasicType<T> {
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
	Add status byte corresponding to the channel
*/
const addStatusByte = function (message: MessageType, start: number, channel: ChannelType): MessageType {
	if (betweenInclusive(channel, 1, 16)) {
		throw new RangeError(`The MIDI channel ${channel}, is not between 1 and 16 (inclusive).`);
	}

	// Return message array (don't mutate)
	// Channel 1's first byte => `start`
	// Channel 16's first byte => `start` + 15
	return [(channel - 1) + start, ...message];
};


/*
	Send arrays of MIDI bytes
*/
const send: SendType<T> = function (this: T, message: MessageType) {
	// Check if all bytes are numbers and in range
	if (!message.every((value: number) => betweenInclusive(value, 0, 255))) {
		throw new RangeError("The message to be sent to the device contained a byte that was out of range.");
	}

	// Send it via node-midi's output class instance associated with this device
	try {
		this.output.sendMessage(message);
	} catch (error) {
		throw new Error(`Failed to send ${message} via MIDI.\n\n${error}`);
	}

	// Method chaining
	return this;
};
// Send MIDI bytes with status bytes2
// Status bytes from 128 to 143
send.noteoff = function<T> (this: T, message: MessageType, channel: ChannelType = 1) {return this.send(addStatusByte(message, 128, channel))};
// Status bytes from 144 to 159
send.noteon = function<T> (this: T, message: MessageType, channel: ChannelType = 1) {this.send(addStatusByte(message, 144, channel))};
// Status bytes from 160 to 175
send.polykeypressure = function<T> (this: T, message: MessageType, channel: ChannelType = 1) {this.send(addStatusByte(message, 160, channel))};
// Status bytes from 176 to 191
send.controlchange = function<T> (this: T, message: MessageType, channel: ChannelType = 1) {this.send(addStatusByte(message, 176, channel))};
// Status bytes from 192 to 207
send.programchange = function<T> (this: T, message: MessageType, channel: ChannelType = 1) {this.send(addStatusByte(message, 192, channel))};
// Status bytes from 208 to 223
send.monokeypressure = function<T> (this: T, message: MessageType, channel: ChannelType = 1) {this.send(addStatusByte(message, 208, channel))};
send.channelpressure = send.monokeypressure;
// Status bytes from 224 to 239
send.pitchbend = function<T> (this: T, message: MessageType, channel: ChannelType = 1) {this.send(addStatusByte(message, 224, channel))};
// Send `[sysex status byte, IDs, message, EOX]`
send.systemexclusive = function<T> (this: T, message: MessageType) {this.send([240, ...message, 247])};
send.sysex = send.systemexclusive;


export default send;
