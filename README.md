<div align="center"><img alt="Rocket" src="./img/cover/github-cover.png"></div>

[![npm version](https://img.shields.io/npm/v/launchpad-rocket.svg)](https://www.npmjs.com/package/launchpad-rocket)
[![dependencies: lodash | midi](https://img.shields.io/badge/dependencies-lodash%20%7C%20midi-lightgrey.svg)](https://github.com/evelynhathaway/launchpad-rocket/network/dependencies)
[![license](https://img.shields.io/github/license/evelynhathaway/launchpad-rocket.svg)]()
[![wiki](https://img.shields.io/badge/wiki-GitHub-lightgrey.svg)](https://github.com/evelynhathaway/launchpad-rocket/wiki)


## Prerequisites
- [Node.js](https://nodejs.org/en/download/) - recent version required for some ES6 features
- [justinlatimer/node-midi](https://github.com/justinlatimer/node-midi) - also requires node-gyp, Python, etc.


## Installation
###### From npm
```
$ npm install launchpad-rocket
```
###### As a dependency
```
$ npm init
$ npm install launchpad-rocket --save
```
###### From source
```
$ git clone https://github.com/evelynhathaway/launchpad-rocket
$ cd launchpad-rocket/
$ npm install
```


---


## Getting Started
1. Plug in your Launchpad
2. Make sure your computer installed the drivers or [install them manually](https://us.novationmusic.com/launch/launchpad/support-downloads)
3. Install Rocket
4. Create a new `.js` file
5. `require()` the package
6. Browse the [wiki](https://github.com/evelynhathaway/launchpad-rocket/wiki)

### Example
```js
// Require Rocket
const rocket = require("launchpad-rocket");

// Make a new Launchpad instance from the first Launchpad it finds
const launchpad = new rocket.Launchpad();

// Create a Button instance on the Launchpad with at (0, 0)
const button = new rocket.Button(0, 0, launchpad);
// Set it's color to pink
button.setColor("pink");
// Log to console on press
button.on("press", function() {
	console.log("3... 2... 1... Blast off!");
});

// Close session with your Launchpad
launchpad.close();
```


## Supported Devices
- Launchpad MK2

Currently only the Launchpad MK2 is supported, but adding support for a device via a config file is easy! If it doesn't immediately work with a config file, create an issue and I'll update the code in conjunction. If you're interested in expanding the support to your device, contact me or check out a related issue.

There are other APIs available on GitHub as well.


## Contributing
If you find any bugs or would like to suggest features, [make an issue](Issue template TODO) for it being as descriptive as possible and I'll do my best to address it.

If you have a Launchpad that's not supported, have ideas for new features, or just want to fix it up a bit; pull requests are highly appreciated.


## License
Copyright Evelyn Hathaway, [MIT License](https://github.com/evelynhathaway/launchpad-rocket/blob/master/LICENSE)
