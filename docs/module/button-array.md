# Module - `button-array.js`
The button array constructor that makes an array with instance methods. ButtonArray is constructor function that returns a proxied array of [Buttons](button.md). On that array is an innumerable property named device for referencing the device is belongs to and a prototype with a few basic methods as well as methods for querying and interacting that get mixed in later. The prototype also has the prototype of [SubEmitter](sub-emitter.md). The Proxy around the array serves as an endpoint for properties ending in `Each` which return an array of the results for the array of buttons.

The results of the constructor can be iterated upon and accessed as you would a standard array.
