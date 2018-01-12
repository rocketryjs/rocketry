# Methods
## `add`
Adds a new device configuration.
#### Arguments
##### `name`
- `string`: Key for the new configuration
##### `data`
- `object`: Configuration data
#### Returns
`this` for method chaining
#### Example
See [Adding Device Support - Adding](Adding-Device-Support.md#adding)

## `remove`
Removes an existing device configuration.
#### Arguments
##### `name`
- Key for the configuration to remove
#### Returns
`this` for method chaining
#### Example
See [Adding Device Support - Removing](Adding-Device-Support.md#removing)


## `extend`
Extends an existing device configuration using prototypes.
#### Arguments
##### `child`
- `string`: Key for the new configuration
##### `parent`
- `string`: The parent's key to extend
##### `data`
- `object`: Configuration data
#### Returns
`this` for method chaining
#### Example
See [Adding Device Support - Extending](Adding-Device-Support.md#extending)


## `get deviceRegex`
Getter for a regular expression that's used internally for getting the device's type for working with config files.
#### Returns
`regexp`: Matches prefix and suffix for MIDI devices, and a matching group that results in the key used in creating a configuration.


---


# Properties
## `devices`
All of the supported devices in an `object` in `{"device name": {}}` format.
