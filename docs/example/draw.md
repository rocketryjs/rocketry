# Example - `draw.js`
## Description
Paint with your Launchpad! A fun example project that uses many different interaction patterns and a large portion of the API's features.


## Starting
- [Install Rocketry](../installation.md)
- Run in your terminal using the correct path
```bash
$ node ./example/draw.js
```


---


## How to Use
Press a palette button on the right side of your device to set your current color and then paint onto the pad buttons or use any of the functions below.


### Modes
#### Lighting
The default mode where the pad buttons are simply "painted" with the current color. Switch to lighting mode by tapping an active mode button a second time or press the right column of palette button selectors.

#### Flashing
Flash between the light on any pad button (off or otherwise) and the current color. Paint or pulse overrides this if performed afterward. Use the up arrow button to trigger flashing mode (an extra tap will switch back to lighting mode).

#### Pulsing
Pulse the brightness of the current color on any pad button. Paint or flash overrides this if performed afterward. Use the down arrow button to trigger pulsing mode (an extra tap will switch back to lighting mode).

#### Erasing
Remove lighting, flashing, and pulsing from any pad button by pressing the user 2 button (an extra tap will switch back to lighting mode) and then the button to erase.

#### Palette Selection
Tap on an already selected color to trigger the presentation and selection of the standard colors. Tap on any color displayed on the pad buttons to change the palette button that triggered palette selection mode's color and your current color to the selected one. You can already tap on any palette button to exit without changes. Other mode's buttons will perform their action and exit from the palette without changes to the selected palette color button. If the color range for your device is larger than your amount of pad buttons you can use the [navigation buttons](#navigation) to display the later colors.


### Navigation
Use the right arrow and left arrow buttons to navigate your drawings or palette colors in [palette selection mode](#palette-selection). The first drawing will always be the leftmost drawing and navigating to a new drawing will create a blank one for you.


### Clearing
The session button will wipe all of the bad buttons as if performed by the [eraser](#erasing) or remove it from memory if there's another drawing to switch to.


### Filling
The user 1 button will fill your current color onto all of the pad buttons, wiping all lights, flashes, and pulses.


### Exiting
Press and release the mixer button to exit the program and darken the device. Press and don't release the mixer button then force exit the program using `ctrl + c` to darken only the UI elements for displaying pixel art.
