# Standard RGB
The RGB Launchpads (currently only the Pro and MK2, sorry Mini) support 128 standard colors to be used when lighting a button or any other command that requires a color.
#### Example
```js
const button = new rocket.Button([0, 0]);

// Set the bottom left button to this nice decimal color
button.setColor(8);

// Turn off that pesky gross sepia color
button.setColor(0);
```

## From Novation's Programmer's Reference
This doesn't tell the full story and they look super gross! Novation exaggerated the colors to distinguish the dimmer colors from the brighter.

![Color table from Novation](https://github.com/evelynhathaway/launchpad-rocket/raw/master/img/colors/from-programmers-reference.png)

## From Photographs
I did start from (0, 0) rather than from top-left since that made sense when adding the default color names. I tried to use mainly page one for the default colors since the second page is mainly granulation of the those. I tried to color correct these photographs from a RAW image. You can click them to see the full resolution adjusted JPEG files on the repo.

### Page One
Here are the colors 0 - 63 which are on the first part of the image from Novation.

[![Page one of the default colors.](https://github.com/evelynhathaway/launchpad-rocket/raw/master/img/colors/page-one.png)](https://github.com/evelynhathaway/launchpad-rocket/blob/master/img/colors/page-one.jpg)

### Page Two
Colors 64 - 127, again starting from (0, 0) rather than from top-left.

[![Page two of the default colors.](https://github.com/evelynhathaway/launchpad-rocket/raw/master/img/colors/page-two.png)](https://github.com/evelynhathaway/launchpad-rocket/blob/master/img/colors/page-two.jpg)


# Full RGB
The Launchpads that support the 128 colors mentioned above also support RGB colors. Sadly the range of each brightness value is 0 - 63 (maybe the full in the heading should have quotation marks 😝). You can only use these colors when setting a button's color and not a column, row, text scrolling, etc. You can check out all of the supported formats of the color on [`normalizeColor()`](Launchpad.md#normalizecolor).
Set the bottom left button to this nice RGB color
#### Example
```js
// Object of numbers
new rocket.Button([0, 0], launchpad).setColor({
	"red": 10,
	"green": 20,
	"blue": 30
});
```
```js
// Object of numbers, abbreviated
new rocket.Button([0, 0], launchpad).setColor({
	"r": 10,
	"g": 20,
	"b": 30
});
```
```js
// Array of numbers
new rocket.Button([0, 0], launchpad).setColor([10, 20, 30]);
```


---


# Named Colors

## Default
Using those images and counting or using a table to find out the decimal value every time was quite annoying, so I added some default names that you can use in place of decimal values. It's also extendable and works with RGB and other named colors. If this changes, I'd hope I remembered to update the docs, but you should check out the [source](https://github.com/evelynhathaway/launchpad-rocket/blob/master/src/config/rgb-colors.js) if you think I forgot (and maybe remind me via issue). You should notice that black is actually off and there are a few aliases.

| Name (string) | Value (decimal / RGB object)|
| :------------ | :-------------------------- |
| red           | 5                           |
| pink          | 95                          |
| fuchsia       | 58                          |
| purple        | 55                          |
| deep purple   | 81                          |
| indigo        | 50                          |
| blue          | 45                          |
| light blue    | 41                          |
| cyan          | 37                          |
| teal          | 65                          |
| green         | 23                          |
| light green   | 21                          |
| lime          | 17                          |
| yellow        | 62                          |
| amber         | 61                          |
| orange        | 9                           |
| deep orange   | 11                          |
| brown         | 83                          |
| sepia         | 105                         |
| gray          | 71                          |
| grey          | "gray"                      |
| blue gray     | 103                         |
| blue grey     | "blue gray"                 |
| white         | 3                           |
| black         | 0                           |
| off           | "black"                     |

## Custom
You can add your own color names to a specific Launchpad instance by passing an object in the format of `{"name": value}` where `value` is the value you'd usually pass into `Button.setColor()` and `name` is the string you'll use instead.
#### Example
```js
// Require Rocket
const rocket = require("launchpad-rocket");

// Make a new Launchpad instance (don't add this to your code if you already have one)
const launchpad = new rocket.Launchpad();

// Make your object of colors
const myColorNames = {
	"fabulous": 57,
	"alias": "fabulous",
	"a cool rgb color": {
		"red": 10,
		"green": 20,
		"blue": 30
	}
};

// Tell it to use your colors over the defaults although, it will fallback to them if needed
launchpad.colors = myColorNames;

// Use it as you'd use a default color name
new rocket.Button([0, 0], launchpad).setColor("fabulous");
```
