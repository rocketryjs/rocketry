import {EventEmitter} from "events";
import {pull} from "lodash";
import {Device} from "./device";
import {Captures, Message, Meta} from "./types";


export class SubEmitter<D extends Device<D>> extends EventEmitter {
	device: D;

	constructor (device: D) {
		super();
		this.device = device;
	}


	// Extend EventEmitter methods
	// I don't believe I can use super and meta program to reduce redundancy.
	// If you can, hit me up with and issue or pull request.
	// I've tried a proxy and just setting to the prototype and they both have their issues.
	addListener (...args: Parameters<NodeJS.EventEmitter["addListener"]>): this {
		super.addListener(...args);
		return this.updateListeners();
	}
	on (...args: Parameters<NodeJS.EventEmitter["on"]>): this {
		super.on(...args);
		return this.updateListeners();
	}
	once (...args: Parameters<NodeJS.EventEmitter["once"]>): this {
		super.once(...args);
		return this.updateListeners();
	}
	prependListener (...args: Parameters<NodeJS.EventEmitter["prependListener"]>): this {
		super.prependListener(...args);
		return this.updateListeners();
	}
	prependOnceListener (...args: Parameters<NodeJS.EventEmitter["prependOnceListener"]>): this {
		super.prependOnceListener(...args);
		return this.updateListeners();
	}
	removeListener (...args: Parameters<NodeJS.EventEmitter["removeListener"]>): this {
		super.removeListener(...args);
		return this.updateListeners();
	}
	removeAllListeners (...args: Parameters<NodeJS.EventEmitter["removeAllListeners"]>): this {
		super.removeAllListeners(...args);
		return this.updateListeners();
	}


	// Record listeners for relaying from Device to Button(s)
	updateListeners (): this {
		// Assume empty and should remove from instances until a listener is found
		let isEmpty = true;
		const {emitters} = this.device;
		const events = this.eventNames();


		for (const event of events) {
			if (this.listenerCount(event)) {
				isEmpty = false;
				break;
			}
		}

		if (isEmpty && emitters.includes(this)) {
			pull(emitters, this);
		} else if (!isEmpty && !emitters.includes(this)) {
			emitters.push(this);
		}

		return this;
	}

	// Default will emit hook for fallback
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	willEmit (event: string, message: Message, captures: Captures, meta: Meta): boolean {
		return true;
	}
}
