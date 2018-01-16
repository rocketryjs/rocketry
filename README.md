<div align="center">

![Rocket](docs/images/cover.png)

[![npm version](https://img.shields.io/npm/v/launchpad-rocket.svg)](https://www.npmjs.com/package/launchpad-rocket)
[![build status](https://img.shields.io/travis/evelynhathaway/launchpad-rocket.svg)](https://travis-ci.org/evelynhathaway/launchpad-rocket)
[![dependencies: lodash, midi](https://img.shields.io/badge/dependencies-lodash%2C%20midi-lightgrey.svg)](https://github.com/evelynhathaway/launchpad-rocket/network/dependencies)
[![license](https://img.shields.io/github/license/evelynhathaway/launchpad-rocket.svg)](/LICENSE)
[![documentation](https://img.shields.io/badge/documentation-./docs-lightgrey.svg)](docs)

</div>


## Description
Rocket is an interface for the Novation Launchpad product line written in Node.js. It's goal is to take care of the quirks of the commands exposed by the device so you can write integrations at a higher level quickly. Rocket is still in its early stages and should be considered a beta. I'm open to any suggestions on the process or project big or small.


## Features
### Design
- Multi-platform
- Automatic and manual detection of devices
- Support for the Launchpad MK2
- Planned support for Launchpad Mini and Launchpad Pro
- Querying for buttons by name, coordinates, etc.
	- Query for many buttons at once by group as well
- Shims for commands that aren't supported by the device
	- For instance, light the whole device with an RGB color
- Unit tests and manual integration tests

### Interaction
- Events for press and release of buttons
- Light, flash, or pulse buttons
- Change the layout
- Scroll ASCII characters across the device
- Arrays of buttons can run commands for each button
	- You can use less for loops
	- Events trigger an array when any button inside fires
	- Lighting of buttons is quicker in a group
- Inquire for information about the device
- [And more...](docs/interaction.md)


## Installation
###### From npm
```bash
$ npm install launchpad-rocket
```
###### As a dependency
```bash
# Create package.json for your own module if you haven't already
$ npm init

# Install Rocket and add to dependencies
$ npm install launchpad-rocket --save
```
###### From source
```bash
$ git clone https://github.com/evelynhathaway/launchpad-rocket
$ cd launchpad-rocket/
$ npm install
```
See [Documentation > Installation](docs/installation.md) for more information.


---


## Getting Started
1. Plug in your Launchpad
2. Make sure your computer installed the drivers or [install them manually](https://us.novationmusic.com/support/product-downloads?product=Launchpad)
3. [Install Rocket](docs/installation.md)
4. [Try the "Getting Started" example](docs/getting-started.md)
4. Create a new `.js` file
5. `require()` the package
6. Browse the [documentation](docs)

### Example
<!-- Also change /doc/getting-started.md -->
```js
// Require Rocket
const rocket = require("launchpad-rocket");

// Make a new device instance
// This method will automatically pick a supported device and its class
const launchpad = new rocket();

// Get a button instance on the Launchpad at bottom-left button
// There are many other ways to get buttons like column, row, quadrant, etc.
const button = launchpad.query.by.coordinates(0, 0);

// Set its color to pink
// Rocket supports standard RGB, full RGB, and bi-color values or their names
button.light("pink");

// Log to console on press of the bottom-left button
// Rocket passes helpful values into your function, but let's not use them now
button.on("press", function() {
	console.log("3... 2... 1... Blast off!");
});

// Reset the device and close connection on release of the button named "mixer"
launchpad.query.by.name("mixer").on("release", function() {
	console.log("Launch aborted!");

	// You can use `this.device` instead of `launchpad` inside of this, but let's use our own reference
	// Reset the Launchpad to defaults (lights, layout, etc)
	launchpad.reset();
	// Close MIDI ports and cleanup
	launchpad.close();
});
```


---


## Supported Devices
- Launchpad MK2

Currently only the Launchpad MK2 is supported, but and support for the Launchpad Mini and Launchpad Pro are planned. Hopefully the module is also structured in such a way that other Novation devices could be added in the future with a minimal amount of breaking changes. If you're interested in expanding the support to your device, contact me or check out a related issue.


## Other APIs
While this API is maturing, I wouldn't be hurt if you took a look at some other open source APIs on GitHub. Many are also a work-in-progress and some are abandoned. ([relevant xkcd](https://xkcd.com/927/))

| Repository                                                                            | Language   | Supports  |
|---------------------------------------------------------------------------------------|------------|-----------|
| [tjhorner/node-launchpad-mk2](https://github.com/tjhorner/node-launchpad-mk2)         | JavaScript | Pro, MK2? |
| [jasonspriggs/LP4J](https://github.com/jasonspriggs/LP4J)                             | Java       | MK2       |
| [OlivierCroisier/LP4J](https://github.com/OlivierCroisier/LP4J)                       | Java       | Mini, S   |
| [Granjow/launchpad-mini](https://github.com/Granjow/launchpad-mini)                   | JavaScript | Mini, S   |
| [stevenleeg/launchpadder](https://github.com/stevenleeg/launchpadder)                 | JavaScript | Mini, S   |
| [sydlawrence/node-midi-launchpad](https://github.com/sydlawrence/node-midi-launchpad) | JavaScript | Mini, S   |
| [millerpeterson/js-launchpad](https://github.com/millerpeterson/js-launchpad)         | JavaScript | Mini, S   |


## Contributing
If you find any bugs or would like to suggest features, [make an issue](https://github.com/evelynhathaway/launchpad-rocket/issues/new) for it being as descriptive as possible and I'll do my best to address it.

If you have a device that's not supported, have ideas for new features, or just want to fix it up a bit; pull requests are highly appreciated.


## License
Copyright Evelyn Hathaway, [MIT License](https://github.com/evelynhathaway/launchpad-rocket/blob/master/LICENSE)
