# Functions
#### Usage
```js
rocket._core.function();
```


## `newInput`
Gets a MIDI input.
#### Returns
`midi.input`


## `newOutput`
Gets a MIDI output.
#### Returns
`midi.output`


## `getFirstLaunchpad`
Gets the first supported Launchpad's port for [`node-midi`](https://github.com/justinlatimer/node-midi).
#### Arguments
##### `channel`
Either in out out for each respective port type.
- `string`: ("in" | "out")
#### Returns
`number`: The first matched port number.


## `send`
Send commands to a Launchpad instance.
#### Arguments
##### `command`
Either in out out for each respective port type.
- `string`: a command name from the device's config
- `array`: a series of MIDI bytes
##### `args`
Either in out out for each respective port type.
- `object`: key value pairs of parameters that may appear in `command` or the config
#### Returns
`Launchpad`: The instance of Launchpad passed into this function for method chaining


## `receive`
Receives commands from a Launchpad instance.
#### Arguments
##### `launchpad`
The instance of Launchpad to receive from.
- `Launchpad`
#### Returns
`Launchpad`: The instance of Launchpad passed into this function for method chaining
