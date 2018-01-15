# Interaction
<!-- TOC depthFrom:1 depthTo:3 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Interaction](#interaction)
	- [Device](#device)
	- [Buttons](#buttons)
	- [Querying Buttons](#querying-buttons)
	- [Lighting](#lighting)
		- [Standard RGB](#standard-rgb)
		- [Full RGB](#full-rgb)
		- [Bi-color](#bi-color)
	- [Darking](#darking)

<!-- /TOC -->

## Device

## Buttons
## Querying Buttons

## Lighting
Set the color of a button or multiple buttons.
```js
// Using color names
button.light("red");
```
### Standard RGB
```js
// Set the button to this decimal color
button.light(8);
```
### Full RGB
```js
// Object of numbers
button.light({
	"red": 10,
	"green": 20,
	"blue": 30
});
```
```js
// Object of numbers, abbreviated
button.light({
	"r": 10,
	"g": 20,
	"b": 30
});
```
```js
// Array of numbers
button.light([10, 20, 30]);
```
### Bi-color
```js
// Array of numbers
button.light([3, 0]);
```

## Darking
```js
button.dark();
```
