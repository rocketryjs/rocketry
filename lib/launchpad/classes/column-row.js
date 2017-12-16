const ColumnRow = class {
	constructor(value) {
		this.value = value;
	}

	// Aliases for setColor
	set color(color) {
		this.setColor(color);
	}
	light(color) {
		return this.setColor(color);
	}
	dark() {
		return this.setColor("off");
	}
};


let classes = [];
(function(classNames) {
	for (const className of classNames) {
		const classNameLower = className.toLowerCase();

		classes[className] = class extends ColumnRow {
			constructor(value) {
				super(value);

				// Method chaining
				return this;
			}

			setColor(color) {
				color = this.contructor.launchpad._normalizeColor(color);

				if (Array.isArray(color)) {
					// RGB
					throw new TypeError("Columns and rows can't be set to RGB colors all at once via MIDI.");
				} else if (typeof color === "number") {
					// Basic
					core.send(`light ${classNameLower}`, {[classNameLower]: this.value, color}, this.contructor.launchpad);
				}

				// Method chaining
				return this;
			}

			static [`is${className}`](object) {
				return object instanceof this;
			}
		};
	}
})(["Column", "Row"]);


module.exports = classes;
