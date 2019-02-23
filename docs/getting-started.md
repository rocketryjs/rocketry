# Getting Started

<!-- Also change /README.md -->

1. [Install Rocketry](installation.md)

```bash
npm install @rocketry/core
```

2. Create a new `.js` file
3. `require()` the package in your new JavaScript file

```js
// Require Rocketry
const rocketry = require("@rocketry/core");
```

4. Create a new device instance

```js
// Make a new device instance
// This method will automatically pick a supported device and its class
const launchpad = new rocketry();
```

5. Crete a Button instance

```js
// Get a button instance on the Launchpad at bottom-left button
// There are many other ways to get buttons like column, row, quadrant, etc.
const button = launchpad.query.by.coordinates(0, 0);
```

6. Set that button to a [color of your choice](color.md)

```js
// Set its color to pink
// Rocketry supports standard RGB, full RGB, and bi-color values or their names
button.light("pink");
```

7. Add an event listener on your button

```js
// Log to console on press of the bottom-left button
// Rocketry passes helpful values into your function, but let's not use them now
button.on("press", function() {
    console.log("3... 2... 1... Blast off!");
});
```

8. Reset and close the connection

```js
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

9. Browse the [documentation page about interaction](interaction.md)

## Result

###### index.js

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
