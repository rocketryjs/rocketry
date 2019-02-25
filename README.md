<div align="center">

![Rocketry cover image](docs/images/cover.png)

[![npm organization: @rocketry](https://badgen.net/badge/npm/%40rocketry/fb3e44?icon=npm)](https://www.npmjs.com/org/rocketry)
[![build status](https://badgen.net/travis/rocketryjs/rocketry/master?icon=travis)](https://travis-ci.com/rocketryjs/rocketry)
[![maintained with lerna](https://badgen.net/badge/maintained%20with/lerna/cc00ff)](https://github.com/lerna/lerna)
[![dependencies: 3](https://badgen.net/badge/dependencies/3/blue)](https://github.com/rocketryjs/rocketry/network/dependencies)
[![license](https://badgen.net/badge/license/MIT/blue)](/LICENSE)
[![documentation](https://badgen.net/badge/docs/github/blue)](docs)

</div>

## Description

Rocketry is an interface for the Novation Launchpad product line written in JavaScript. Its goal is to take care of the quirks of the commands exposed by the device so you can write integrations at a higher level quickly. Rocketry is still in its early stages and should be considered a beta. I'm open to any suggestions on the process or project big or small.

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

```bash
npm install @rocketry/core
```

See [Documentation > Installation](docs/installation.md) for more information.

---

## Getting Started

1. Plug in your Launchpad
2. Make sure your computer installed the drivers or [install them manually](https://us.novationmusic.com/support/product-downloads?product=Launchpad)
3. [Install Rocketry](docs/installation.md)
4. [Try the "Getting Started" example](docs/getting-started.md)
5. Create a new `.js` file
6. `require()` or `import` the package
7. Browse the [documentation](docs)

### Example

<!-- Also change /doc/getting-started.md -->

```js
// Require Rocketry
const rocketry = require("@rocketry/core");

// Make a new device instance
// This method will automatically pick a supported device and its class
const launchpad = new rocketry();

// Get a button instance on the Launchpad at bottom-left button
// There are many other ways to get buttons like column, row, quadrant, etc.
const button = launchpad.query.by.coordinates(0, 0);

// Set its color to pink
// Rocketry supports standard RGB, full RGB, and bi-color values or their names
button.light("pink");

// Log to console on press of the bottom-left button
// Rocketry passes helpful values into your function, but let's not use them now
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

## Why?

[I think @TaranVH sums up my intentions the best.](https://youtu.be/kB2kIAEhjpE) *And his keyboards don't light up and control, say for instance, [the Toggl API](https://github.com/toggl/toggl_api_docs#nodejs).*

## Contributing

If you find any bugs or would like to suggest features, [make an issue](https://github.com/rocketryjs/rocketry/issues/new) for it being as descriptive as possible and I'll do my best to address it.

If you have a device that's not supported, have ideas for new features, or just want to fix it up a bit; pull requests are highly appreciated.

## License

Copyright Evelyn Hathaway, [MIT License](https://github.com/rocketryjs/rocketry/blob/master/LICENSE)
