/*
	JS Doc is dilutes the code more, is more limited, more confusing to the user, and slower than manually documenting with nice Markdown for me.
*/



/**
	@member {Object} _core {@link module:rocket/core}
*/
/**
	@member {Object} support {@link module:rocket/support}
*/
/**
	@member {Class} Launchpad
	@see module:rocket/launchpad~Launchpad
*/
/**
	@member {Class} Button
	@see module:rocket/button~Button
*/

/**
	@member {Class} Column
	@see module:rocket/column-row~Column
*/
/**
	@member {Class} Row
	@see module:rocket/column-row~Row
*/
/* JS Doc TypeDefs */
/**
	Supported color formats. See child types for examples.
	@typedef {(StandardColor|RGBColor)} Color
*/
/**
	Supported standard color formats. A single number or color name that results in one.
	@typedef {(number|string)} StandardColor
	@example <caption>Number in range of the device's support</caption>
	* 50
	@example <caption>Named color from the device's config</caption>
	* "pink"
*/
/**
	Supported RGB color formats. RGB color values in order of [r, g, b] as a series of numbers or Array, Obejct with {red: value, green: value, blue: value} (can use r, g, and b), or color name that results in this format.
	@typedef {(...number|Array<number>|Object<string, number>|string)} RGBColor
	@example <caption>Series of numbers</caption>
	* 10, 20, 30
	@example <caption>Array of numbers</caption>
	* [10, 20, 30]
	@example <caption>Object of numbers</caption>
	* {
	* 	"red": 10,
	* 	"green": 20,
	* 	"blue": 30
	* }
	@example <caption>Object of numbers, abbreviated</caption>
	* {
	* 	"r": 10,
	* 	"g": 20,
	* 	"b": 30
	* }
	@example <caption>Named color from the device's config</caption>
	* "pink"
*/



/**
	@module rocket/core
*/
/**
	Gets a MIDI input.
	@function newInput
	@returns {midi.input}
*/
/**
	Gets a MIDI output.
	@function newOutput
	@returns {midi.output}
*/
/**
	Gets the first supported Launchpad's port.
	@function getFirstLaunchpad
	@param {string} channel - Either input or output.
	@returns {number} The first matched port number.
*/
/**
	Send commands to a Launchpad instance.
	@function send
	@param {(string|array)} command - The command to be sent. Either a reference to a message in the config or an array of MIDI bytes and parameters.
	@param {Object.<string, number>} args - Key value pairs of parameters that may appear in `command` or the config.
	@param {string} launchpad - The instance of Launchpad.
	@returns {Launchpad} The instace of Launchpad passed into this
*/
/**
	Receives commands from a Launchpad instance.
	@function receive
	@arg {string} launchpad - The instance of Launchpad.
	@returns {Launchpad} The instace of Launchpad passed into this
*/



/**
	@module rocket/launchpad
*/
/**
	Creates a new Launchpad.
	@class Launchpad
	@param {...(number|Array.<number>|Object.<string, number>)} [ports] - Input and output MIDI ports used for [node-midi]{@link https://github.com/justinlatimer/node-midi}. Only numbers are repeatable (up to 2 times).
	@param {number} [(ports[0]|ports[0][0]|ports[0].input)=[_core.getFirstLaunchpad("input")]{@link module:rocket/core~getFirstLaunchpad}] - Input port
	@param {number} [(ports[1], ports[0]|ports[0][1]|ports[0].output)=[_core.getFirstLaunchpad("output")]{@link module:rocket/core~getFirstLaunchpad}] - Output port
	@throws {TypeError} if port type is invalid
	@throws {Error} if device isn't supported
	@returns {Launchpad} Launchpad instace (`this` for method chaining)
	* @example <caption>Without port (get first supported device)</caption>
	* const launchpad = new rocket.Launchpad();
	* @example <caption>With ports in arguments</caption>
	* const launchpad = new rocket.Launchpad(1, 0);
	* @example <caption>With ports in array</caption>
	* const launchpad = new rocket.Launchpad([1, 0]);
	* @example <caption>With ports in Object</caption>
	* const launchpad = new rocket.Launchpad({"in": 1, "out": 0});
*/

/**
	Last created Launchpad instance. Allows for users to ommit the instace in, say, Button creation.
	@member {Launchpad} lastInstance
	@memberof Launchpad
	@static
*/
/**
	Sets [`launchpad.device`]{@link ~device} from [`launchpad._device`]{@link ~get-_device}, [`launchpad.events`](#events) from its config, and starts receiving input from `_core`. It also most notablity opens both input and output ports using [node-midi]{@link https://github.com/justinlatimer/node-midi}'s `openPort()`.
	@method open
	@memberof module:rocket/launchpad~Launchpad
	@throws {Error} if device isn't supported
	@returns {Launchpad} Launchpad instace (`this` for method chaining)
	@instance
*/
/**
	The device name that the instance is from [`support.deviceRegex`](TODO) that it matches from the [getter _device]{@link ~_device}
	@member {string} device
	@memberof module:rocket/launchpad~Launchpad
	@instance
*/
/**
	Closes both input and output ports using [node-midi]{@link https://github.com/justinlatimer/node-midi}'s `closePort()`.
	@method close
	@memberof module:rocket/launchpad~Launchpad
	@returns {Launchpad} Launchpad instace (`this` for method chaining)
	@instance
*/
/**
	TODO.
	@method receive
	@memberof module:rocket/launchpad~Launchpad
	@param {number} deltaTime - Time since last message TODO
	@param {string} message - Message string TODO
	@returns {Launchpad} Launchpad instace (`this` for method chaining)
	@instance
*/
/**
	A getter for finding what device the instance is. It will throw an error if it doesn't match any supported device. You can prevent this by [adding a config object for your device]{@link https://github.com/evelynhathaway/launchpad-rocket/wiki/Adding-Device-Support}. Use the property [`launchpad.device`]{@link ~device} to get the result from [`launchpad.open()`]{@link ~open} since this doesn't need to run more than once.
	@member {string} _device
	@memberof module:rocket/launchpad~Launchpad
	@instance
*/
/**
	Returns the configuration information for the launchpad from [support]{@link module:rocket/support}.
	@method getConfig
	@memberof module:rocket/launchpad~Launchpad
	@param {...string} paths - Object path compatible with [`_.at(object, paths)`]{@link https://lodash.com/docs/#at}
	@returns {Object} data at that path in the config file TODO
	@instance
*/
/**
	Returns a boolean indicating if any configuration information for the Launchpad from [launchpad.getConfig()]{@link ~getConfig} exists.
	@method hasConfig
	@memberof module:rocket/launchpad~Launchpad
	@param {...string} paths - Object path compatible with [`_.at(object, paths)`]{@link https://lodash.com/docs/#at}
	@returns {boolean} Truth value based on presence of ALL config properties
	@instance
*/
/**
	Validates colors, finds colors from their names, and normalizes formats from many into a single one for each RGB and standard colors for internal use.
	@method normalizeColor
	@param {Color} args - Supported color formats
	@memberof module:rocket/launchpad~Launchpad
	@returns {(number|Array.<number>)} Normalized color, either a number for decimal value for a standard color or Array of decimal values for an RGB color like [r, g, b].


	@instance
*/
/**
	Light all of the Launchpad's buttons.
	@method lightAll
	@param {StandardColor} color - Supported standard color formats
	@memberof module:rocket/launchpad~Launchpad
	@returns {Launchpad} Launchpad instace (`this` for method chaining)
	@instance
*/
/**
	Dark all of the Launchpad's buttons using {@link ~lightAll}.
	@method darkAll
	@memberof module:rocket/launchpad~Launchpad
	@returns {Launchpad} Launchpad instace (`this` for method chaining)
	@instance
*/
/**
	Simple shortcut for `object instanceof rocket.Launchpad`.
	@method isLaunchpad
	@memberof module:rocket/launchpad~Launchpad
	@param {Object} object - Object to be tested against instanceof
	@returns {boolean} Result of instanceof
	@static
*/
