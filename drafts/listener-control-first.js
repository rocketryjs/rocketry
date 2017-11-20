// Extend EventEmitter methods
addListener(eventName, listener) {
	this._pushListener(eventName, listener);
	return super.addListener(...arguments);
}
on(eventName, listener) {
	this._pushListener(eventName, listener);
	return super.on(...arguments);
}
once(eventName, listener) {
	this._pushListener(eventName, listener);
	return super.once(...arguments);
}
prependListener(eventName, listener) {
	this._pushListener(eventName, listener);
	return super.prependListener(...arguments);
}
prependOnceListener(eventName, listener) {
	this._pushListener(eventName, listener);
	return super.prependOnceListener(...arguments);
}
removeListener(eventName, listener) {
	this._pullListener(eventName, listener);
	return super.removeListener(...arguments);
}
removeAllListeners(eventName) {
	this._removeListeners(eventName);
	return super.removeAllListeners(...arguments);
}
_pushListener(eventName, listener) {
	if (this.launchpad.events.includes(eventName)) {
		// TODO: add Button instance if not already in array
		this._listeners[eventName].push(listener);
	} else {
		throw new Error("eventName isn't a valid event.");
	}
}
_pullListener(eventName, listener) {
	if (this.launchpad.events.includes(eventName)) {
		// TODO: remove Button instance if all listeners are empty, soft - no error
		_.pull(this._listeners[eventName], listener);
	} else {
		throw new Error("eventName isn't a valid event.");
	}
}
_removeListeners(eventName) {
	if (this.launchpad.events.includes(eventName)) {
		// TODO: remove Button instance if all listeners are empty, soft - no error
		this._listeners[eventName] = [];
	} else {
		throw new Error("eventName isn't a valid event.");
	}
}
