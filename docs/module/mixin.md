# Module - `mixin.js`
This module allows for methods and properties to be shared between objects while retaining class inheritance for syntax.

The method of mixins differs from [MDN's example of mixins](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Mix-ins) and instead uses `Object.assign()` and `Object.defineProperties()` to both the prototype and constructor. The function allows for the mixins to be `require()`'ed and called with `this` bound to the object to add to for easy-to-understand syntax.
