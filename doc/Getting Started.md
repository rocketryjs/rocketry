1. [Install Rocket](Installation.md)
```
$ npm install launchpad-rocket
```
2. Create a new `.js` file
3. `require()` the package in your new JavaScript file
```js
// Require Rocket
const rocket = require("launchpad-rocket");
```
4. Create a new Launchpad instances
```js
// Make a new Launchpad instance from the first Launchpad it finds
const launchpad = new rocket.Launchpad();
```
5. Crete a Button instance
```js
// Create a Button instance on the Launchpad with at (0, 0)
const button = new rocket.Button(0, 0, launchpad);
```
6. Set that button to a [color of your choice](Color.md)
```js
// Set it's color to pink
button.setColor("pink");
```
7. Add an event listener on your button
```js
// Log to console on press
button.on("press", function() {
	console.log("3... 2... 1... Blast off!");
});

```
8. Browse the [interaction related wiki page](Interaction.md)


## Result
###### index.js
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
```
