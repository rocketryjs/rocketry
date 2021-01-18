import type {Captures, Message, Pattern} from "./types";


export const captureMatch = function (key: string, match: Message, captures: Captures): void {
	captures[key] = match;
};

export const matchMessage = function (message: Message, pattern: Pattern): Captures | false {
	// Where the captures will be stored
	const captures: Captures = {};
	let messageCursor = 0;

	for (const key in pattern) {
		const captureGroup = pattern[key];
		const {minBytes, maxBytes, matchBytes} = captureGroup;
		const match = [];

		if (matchBytes) {
			for (const byte of matchBytes) {
				if (byte !== message[messageCursor]) {
					// Byte doesn't match
					return false;
				}
				messageCursor++;
			}
			// All bytes are matched
			match.push(...message.slice(messageCursor - matchBytes.length, messageCursor));
			// Match bytes is mutually exclusive from min bytes and max bytes, early continue
			captureMatch(key, match, captures);
			continue;
		}

		// Add min bytes
		if (minBytes) {
			if (message.length < messageCursor + minBytes) {
				// Min bytes cannot be satisfied
				return false;
			}
			// Add min bytes
			match.push(...message.slice(messageCursor, messageCursor + minBytes));
			messageCursor += minBytes;
		}

		// If min and max bytes are the same
		if (maxBytes && maxBytes === minBytes) {
			// No more can be matched, early continue
			captureMatch(key, match, captures);
			continue;
		}

		// Max bytes (greedy)
		if (maxBytes) {
			const potentialRemainingMatchBytes = maxBytes - (minBytes || 0);
			const remainingMatchBytes = Math.min(potentialRemainingMatchBytes, message.length - messageCursor);
			// Add remaining bytes
			match.push(...message.slice(messageCursor, messageCursor + remainingMatchBytes));
			messageCursor += remainingMatchBytes;
		}
	}

	return captures;
};
