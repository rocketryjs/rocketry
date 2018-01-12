# Intro
Currently, only the Launchpad MK2 is supported. While I'd love to personally add support for all Launchpads myself, I only own one and it's perfect for my setup and getting a Pro would be a downgrade for me. If you have another version, I would love to see support for it to be added. If you need something working yesterday, you can find other APIs on GitHub two of which are written in Node.js.

I created Rocket to write my own API for the Launchpad to learn as much as possible about open source and Node.js. Initially, this meant only for the MK2 but I quickly realized why the other Node.js option didn't work, just a simple SysEx header. This is when I knew my personal learning experience project could easily blow all of those abandoned projects out of the water ([relevant xkcd](https://xkcd.com/927/)) by adding support via configuration files.

# Contributing
If you add support for any Novation Launchpad please contact me or add a pull request / issue. Same goes for finding any issues with a current configuration that you were forced to work around. If it's not a Launchpad and instead some other MIDI controller, I may be up for the challenge of adding that to the scope of this project... maybe. If you don't have a good grasp of JavaScript or MIDI, I'll do my best to help you out too.

If you make a pull request, you should add your config file to [`/src/config/device-name.js`](https://github.com/evelynhathaway/launchpad-rocket/tree/master/src/config) and add support for it at the end of [`/src/support.js`](https://github.com/evelynhathaway/launchpad-rocket/blob/master/src/support.js).


---


# Adding
Maybe you have another lovely product in the Launchpad line or a wildly similar MIDI controller from another company, add support for that beauty by passing an object of [properties](#properties) into `add()`.
## Example
- In this example, the Launchpad Basic is a very basic version of the Launchpad MK2.
```js
rocket.support.add("Launchpad Basic", {
	"buttons": {
		"pad": {
			"_header": 144,
			"x": [0, 8],
			"y": [0, 8],
			"offset": {
				"x": 1,
				"y": 1
			}
		}
	},
	"send": {
		"light": ["header", "led", "color"]
	}
});

// Create launchpad after adding support for it
const myLaunchpadBasic = new rocket.Launchpad();
```


# Removing
You do you, this code removes support.
## Example
```js
rocket.support.remove("Launchpad MK2");
```


# Extending
Say you got a Launchpad MK3 day one of its release on [insert date here] and you notice almost everything would work if it was registered as a MK2. With extensions, you can "copy" all of the data from one config to a new one and make changes to override old data. I say "copy" because JavaScript's prototypes delegate up the chain of `__proto__` and not copy. This could technically allow you to change the parent and have it affect itself as well as its children.

## Example
##### One
- In this example, the MK3 is a carbon copy of the MK2 and only has changes that don't affect Rocket.
```js
rocket.support.extend("Launchpad MK3", "Launchpad MK2", {}); // Must have an empty object

// Create launchpad after adding support for it
const myMarkThree = new rocket.Launchpad();
```
##### Two
- In this example, they removed the mixer button and added a dedicated Ableton button (purely hypothetical, don't worry).
```js
rocket.support.extend("Launchpad MK3", "Launchpad MK2", {
	"button": {
		"mixer": undefined,
		"ableton": 111
	}
});

// Create launchpad after adding support for it
const myMarkThree = new rocket.Launchpad();
```


# Other Patterns
#### Replacing
Completely replace a default config by reassigning. You could also remove and re-add the device if that sinks your submarine.
```js
rocket.support.devices["Launchpad MK2"] = {
	"buttons": {
		"pad": {
			"_header": 144,
			"x": [0, 8],
			"y": [0, 8],
			"offset": {
				"x": 1,
				"y": 1
			}
		}
	},
	"send": {
		"light": ["header", "led", "color"]
	}
};
```


#### Editing
Change the supported device's
```js
rocket.support.devices["Launchpad MK2"].send.light = ["color", "header", "led"];
```
Technically you could also extend itself if you're a madman who wants to retain the original in `__proto__` to replace certain properties on the fly without storing the original. Don't come after me if this breaks (maybe leave an issue instead?).
```js
// Maybe your MK2 has an additional command you want added
rocket.support.extend("Launchpad MK2", "Launchpad MK2", {
	"send": {
		"bootloader": [240, 0, 32, 41, 0, 113, 0, 105, 247]
	}
});

rocket._core.send("bootloader", undefined, launchpad);

// You can also remove it and fallback to the original
delete rocket.support.devices["Launchpad MK2"].send;
```


#### Get All Support Devices
```js
const array = Object.keys(rocket.support.devices);
```


#### Chaining Manipulation Calls
The parentheses around the whole series are purely just syntactic sugar and can be written like any other method chain.
```js
(rocket.support
	.add("Launchpad MK3", {})
	.add("Launchpad MK4", {})
	.extend("Launchpad MK5", "Launchpad MK4", {})
);
```


#### Require a Config File
You can use Node.js' `require()` or ES6's `import` (if transpiling or when Node.js supports it natively) to load your data from another file for both adding and extending.
###### Config File
`config.js`
```js
module.exports = {
	"button": {
		"mixer": undefined,
		"ableton": 111
	}
};
```
###### Implementation
```js
// Use as a normal object
// A good idea might be to assign require to a `const` at the beginning of your file to prevent synchronous requiring
rocket.support.extend("Launchpad MK3", "Launchpad MK2", require("./config.js"));
```


---


# Device Names
For your configuration to apply to your device, you'll need to match the device name you use as a key for your config to the name of the device that it reports from MIDI. My device had the name of `3- Launchpad MK2 0` according to [`node-midi`](https://github.com/justinlatimer/node-midi) so the regular expression that matches supported devices looks for the entire device name surrounded by any number of digits, spaces, or dashes. I removed the digits, spaces, and dashes to get my config key of `Launchpad MK2`.
#### Getting Device Names
If you need to get the name for your device and the product name doesn't work, try executing this.
```js
// MIDI
const midi = require("midi");

// Get all input ports, you could also check for output ports if you cared to
const input = new midi.input();
for (let i = 0; i < input.getPortCount(); i++) {
	console.log(input.getPortName(i));
}
```

# Properties
<!-- TODO -->
The core code is changing a lot right now. Looking at some other [config files](https://github.com/evelynhathaway/launchpad-rocket/tree/master/src/config) and the programmer's reference for your device from Novation might help.


---


Technical information about the support module can be found on [Support](Support.md).
