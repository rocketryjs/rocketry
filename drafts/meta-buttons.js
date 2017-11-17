// TODO: use strings instead of silly classes
// Generate alias classes for all special button types. You can just use `new rocket.Button("volume");` or you can now use a special class in case you need to
// Note: You can't have any duplicate keys in the _core.supportedDevices button object. `rocket.Button[key]` only corresponds to the first supported device's first button set.
const makeSpecialButtonClasses = function(types) {
	for (const key in types) {
		const buttons = types[key];
		// my WeirdlyFormatted button 2 => MyWeirdlyFormattedButton2
		let className = _.capitalize(_.camelCase(key));
		// Skip existing classes
		if (Button[className]) {
			continue;
		}

		Button[className] = class extends Button {
			constructor(launchpad) {
				super([className], launchpad);

				// Method chaining
				return this;
			}

			static [`is${className}`](object) {
				return object instanceof this;
			}
		};

		// Recursive
		if (typeof buttons === "object" && !Array.isArray(buttons)) {
			makeSpecialButtonClasses(buttons);
		}
	}
};
