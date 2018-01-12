# Description
Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.


---


# Table of Contents
<!-- TOC depthFrom:1 depthTo:3 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Description](#description)
- [Table of Contents](#table-of-contents)
- [Construction](#construction)
- [Methods](#methods)
	- [`close`](#close)
	- [`open`](#open)
	- [`get _device`](#get-device)
	- [`getConfig`](#getconfig)
	- [`hasConfig`](#hasconfig)
	- [`normalizeColor`](#normalizecolor)
	- [`normalizeText`](#normalizetext)
	- [`setColor`](#setcolor)
	- [`dark`](#dark)
	- [`scrollText`](#scrolltext)
	- [`stopScrollText`](#stopscrolltext)
- [Static Methods](#static-methods)
	- [`isLaunchpad`](#islaunchpad)
- [Properties](#properties)
	- [`colors`](#colors)
	- [`device`](#device)
	- [`events`](#events)
	- [`input`](#input)
	- [`output`](#output)
	- [`port`](#port)
- [Static Properties](#static-properties)
	- [`lastInstance`](#lastinstance)

<!-- /TOC -->


---


# Construction
Creates a new Launchpad.
#### Arguments
##### *`...ports` (optional)*
Input and output MIDI ports used for [`node-midi`](https://github.com/justinlatimer/node-midi).
- `number`:
	- in: 0th number
	- out: 1st number if defined, otherwise 0th number
- `array`:
	- in: `array[0]`
	- out: `array[1]`
- `object`:
	- in: `object.input`
	- out: `object.output`
- default: the first supported device it can find for each in and out using [`_core.getFirstLaunchpad()`](Core.md#getFirstLaunchpad)
#### Returns
`this` for method chaining
#### Example
Without port (get first supported device)
```js
const launchpad = new rocket.Launchpad();
```
With ports in arguments
```js
const launchpad = new rocket.Launchpad(1, 0);
```
With ports in array
```js
const launchpad = new rocket.Launchpad([1, 0]);
```
With ports in Object
```js
const launchpad = new rocket.Launchpad({"input": 1, "output": 0});
```


---


# Methods
#### Usage
```js
launchpad.method();
```


## `close`
Closes both input and output ports using [`node-midi`](https://github.com/justinlatimer/node-midi)'s `closePort()`.
#### Returns
`this` for method chaining


## `open`
Sets [`launchpad.device`](#device) from [`launchpad.device`](#get-_device), [`launchpad.events`](#events) from its config, and starts receiving input from `_core`. It also most notablity opens both input and output ports using [`node-midi`](https://github.com/justinlatimer/node-midi)'s `openPort()`.
#### Returns
`this` for method chaining


<!-- ## `receive`
TODO
Relays input from the Launchpad to the Button class. -->


## `get _device`
A getter for finding what device the instance is. It will throw an error if it doesn't match any supported device. You can prevent this by [adding a config object for your device](Adding-Device-Support). Use the property [`launchpad.device`](#device) to get the result from [`launchpad.open()`](#open) since this doesn't need to run more than once.
#### Throws
- `Error` if device isn't supported
#### Returns
`string`: the device name in [`support.deviceRegex`](Support#get-deviceregex) that it matches


## `getConfig`
Returns the configuration information for the `launchpad` from [`support`](Support.md).
#### Arguments
##### `...paths`
- `string`: object path compatible with [`_.at(object, paths)`](https://lodash.com/docs/#at)
#### Returns
`object`: data at that path in the config file
#### Example
```js
const configData = launchpad.getConfig("buttons.top", "buttons.right");
```


## `hasConfig`
Returns a boolean indicating if any configuration information for the `launchpad` from [`launchpad.getConfig()`](#getConfig) exists.
#### Arguments
##### `...paths`
- `string`: object path compatible with [`_.at(object, paths)`](https://lodash.com/docs/#at)
#### Returns
`boolean`: truth value based on presence of ALL config properties
#### Example
```js
const hasTopAndRightButtons = launchpad.hasConfig("buttons.top", "buttons.right");
```


## `normalizeColor`
Validates colors, finds colors from their names, and normalizes formats from many into a single one for each RGB and standard colors for internal use.
#### Arguments
##### `color`
Supported [color formats](Color.md).
- `string`: [any color name](Color.md#named-colors) that results in a decimal or RGB color
- `number`: [any decimal color](Color.md#standard-rgb)
- `object`: [an RGB color](Color.md#full-rgb) with decimal values formatted like `{red: value, green: value, blue: value}` or with abbreviated keys
- `array`: decimal values for [an RGB color](Color.md#full-rgb) like `[r, g, b]`
#### Returns
Normalized color, either a number for decimal value for a standard color or Array of decimal values for an RGB color like [r, g, b].


## `normalizeText`
Normalizes text and speed formats into a series of ASCII MIDI bytes.
#### Arguments
##### `text`
- `string`: a string of standard ASCII characters, it is recommended to deburr and validate yourself
- `array`
	- `object`
		- `.text`
			- `string`: same as just passing a string, assumes a speed is also passed
		- `.speed`
			- `number`: speed of the scrolling text, defaults to 4 at the device level
				- range: 1 - 7 inclusive
	- `string`: same as just passing a string but uses the speed of the last
#### Returns
Normalized text, an `array` of number representing speeds on ASCII characters.


## `setColor`
Lights all LEDs with a standard color. Novation doesn't allow for RGB for anything but a single LED and I personally don't plan to polyfill this yet.
#### Aliases
- `set color`: setter for the color
- `light`
- `lightAll`
#### Arguments
##### `color`
- `string`: [any color name](Color.md#named-colors) that results in a decimal color
- `number`: [any decimal color](Color.md)
#### Returns
`this` for method chaining
#### Example
```js
// Pink, by default results in `95`
launchpad.lightAll("pink");
// Other decimal color
launchpad.lightAll(43);
```


## `dark`
Shortcut for `launchpad.setColor("off")`.
#### Aliases
- `darkAll`
#### Returns
`this` for method chaining


<!-- ## `changeLayout`
TODO
#### Arguments
##### `layout`
#### Returns
`this` for method chaining -->


## `scrollText`
Scroll text across the entire device with a standard color. Novation doesn't allow for RGB for anything but a single LED and I personally don't plan to polyfill this yet.
#### Arguments
##### `color`
- `string`: [any color name](Color.md#named-colors) that results in a decimal color
- `number`: [any decimal color](Color.md)
##### `text`
- `string`: a string of standard ASCII characters, it is recommended to deburr and validate yourself
- `array`
	- `object`
		- `.text`
			- `string`: same as just passing a string, assumes a speed is also passed
		- `.speed`
			- `number`: speed of the scrolling text, defaults to 4 at the device level
				- range: 1 - 7 inclusive
	- `string`: same as just passing a string but uses the speed of the last
##### `loop`
- `boolean`: `true` for looping
- `number`: `1` for looping
- default: `false`, no looping
#### Returns
`this` for method chaining


## `stopScrollText`
Stops scrolling text, shortcut for `launchpad.scrollText(0)`.
#### Returns
`this` for method chaining


---


# Static Methods
#### Usage
```js
rocket.Launchpad.method();
```


## `isLaunchpad`
Simple shortcut for `object instanceof rocket.Launchpad`.
#### Arguments
##### `object`
- Any value to be tested against `instanceof`
#### Returns
`boolean`: Result of `instanceof`
#### Example
```js
const test = "I can't remember if this is a launchpad";

if (rocket.Launchpad.isLaunchpad(test)) {
	console.log("What, really?"); // Shouldn't ever run
} else {
	console.log("Of course, duh!");
}
```


---


# Properties
#### Usage
```js
launchpad.property;
```


## `colors`
How you can add your own names to color values internally without having to use your own variables. More information and an example can be found on [Color - Custom](Color.md#Custom).
#### Type
`object`


## `device`
The device name that the instance is from [`support.deviceRegex`](Support.md#deviceregex) that it matches from the [`_device`](#get-_device) getter.
#### Type
`string`


## `events`
Array of possible MIDI input events. Used for button's press and release.
#### Type
`array`


## `input`
Instance of `midi.input` assigned to each `launchpad`, created in `_core`.
#### Type
`midi.input`


## `output`
Instance of `midi.output` assigned to each `launchpad`, created in `_core`.
#### Type
`midi.output`


## `port`
Object containing the input and output ports to use for MIDI. It is usually only an internal property from the construction of the instance. Changing it yourself wouldn't have any effect until you [`close()`](#close) and [`open()`](#open) the `launchpad`.
#### Type
`object`


---


# Static Properties
#### Usage
```js
rocket.Launchpad.property;
```


## `lastInstance`
The last instance for `Launchpad`. This allows for users with only one Launchpad to omit the `launchpad` (instance) parameter from most method calls.
#### Type
`Launchpad`
