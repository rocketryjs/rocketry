# Troubleshooting
## *By Symptom*
<!-- TODO add images -->
| Symptom                                                   | Link                                                                                                                                                         | Probable Reason                                                 |
|-----------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------|
| Rainbow colored ripples                                   | [Connecting Your Launchpad](#connecting-your-launchpad)                                                                                                      | Not plugged in or missing drivers                               |
| Rainbow colored ripples while computer is off or sleeping | [Google: turn off USB power when computer off](https://www.google.com/search?q=turn+off+usb+power+when+computer+off&oq=turn+off+USB+power+when+computer+off) | Not related to Rocketry, the device is powered but not connected  |
| Repeating ripples and rainbow gradients                   | [Connecting Your Launchpad](#connecting-your-launchpad)                                                                                                      | Loose connection to the computer or drivers are being installed |
| Errors while installing or building                       | [Installation](#installation)                                                                                                                                | Lacking build tools                                             |
| Errors while using Rocketry                                 | [By Error](#by-error)                                                                                                                                        | One of us did something wrong...                                |


## *By Error*
<!-- TODO add updated errors -->
| Error                                                                             | Code | Module  | Link                                                                                       | Probable Reason                                                                     |
|-----------------------------------------------------------------------------------|------|---------|--------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|
| Failed to find a supported device. Check your port and connection to your device. |      | new.js  | [Connecting Your Launchpad](#connecting-your-launchpad)                                    | Not plugged in or missing drivers                                                   |
| Your device's output port's name doesn't match your input port's name.            |      | core.js | [Checking Device Information](#checking-device-information)                                | Ports given to or created by Rocketry matched two separate devices                    |
| Invalid port type.                                                                |      | core.js |                                                                                            | Ports given to Rocketry weren't a valid type                                          |
| Invalid port type in array or object of ports.                                    |      | core.js |                                                                                            | Ports given to Rocketry inside the object or array weren't numbers                    |
| Couldn't create MIDI I/O.                                                         |      | core.js | [Checking Device Information](#checking-device-information), [Installation](#installation) | Ports given to Rocketry didn't match a device or node-midi wasn't correctly installed |
| Failed to find a matching port.                                                   |      | core.js |                                                                                            |  remove                                                                        |

---


## Installation
### `node-gyp` Build Failed
###### All
- Make sure you have Python `v2.7.2` or higher (excluding any instances of `v3.x.x` or higher) and a C++ compiler
- Set `npm` and `node-gyp` to use the older version of Python if you have both `v2.x.x` and `v3.x.x` installed on your system
	- `npm config set python /path/to/executable/python2.7 --global`
	- `node-gyp --python /path/to/python2.7`
- Find related issues on [`node-midi`](https://github.com/justinlatimer/node-midi/issues), [`node-gyp`](https://github.com/nodejs/node-gyp/issues), or [`node`](https://github.com/nodejs/node-v0.x-archive/issues/4047) for any errors that occur
###### Unix
- Follow [these directions](https://github.com/nodejs/node-gyp#on-unix) from [`node-gyp`](https://github.com/nodejs/node-gyp)
###### Mac OSX
- Follow [these directions](https://github.com/nodejs/node-gyp#on-mac-os-x) from [`node-gyp`](https://github.com/nodejs/node-gyp)
###### Windows
- Follow [these directions](https://github.com/nodejs/node-gyp#on-windows) from [`node-gyp`](https://github.com/nodejs/node-gyp)
- Install Python 2.7 and Microsoft Visual C++ using `npm install -g windows-build-tools` in an administrative terminal or elevated PowerShell
- Make sure you have Python installed and [in your system path](https://superuser.com/questions/143119/how-to-add-python-to-the-windows-path)

### `node-midi` was Compiled Against a Different Node Version
```
Error: The module 'node_modules\midi\build\Release\midi.node'
was compiled against a different Node.js version using
NODE_MODULE_VERSION 51. This version of Node.js requires
NODE_MODULE_VERSION 59. Please try re-compiling or re-installing
the module (for instance, using `npm rebuild` or `npm install`).
```
Probably caused by an upgrade of Node.js or you ran `nvm use [another version]`. Simply run `npm rebuild` or `npm install` as it says.


## Connecting Your Launchpad
- Make sure your Launchpad is plugged in
- Make sure your computer installed the drivers automatically or [install them manually](https://us.novationmusic.com/support/product-downloads?product=Launchpad)
	- On Windows, check for your device in Device Manager. I have two devices in Device Manager under *Software Devices* (one for input and one for output, if someone made me guess) and one in *Sound, video and game controllers* for my single Launchpad MK2.
- Make sure Rocketry and `node-midi` sees your device by [Checking Device Information](#checking-device-information)


## Checking Device Information
To see your device's name, port numbers, if it's supported, or if Rocketry and `node-midi` sees it — You can run a manual integration test to output all of this information and prompt you for things to look at.

This test is made for making sure the code doesn't break before publishing updates so it uses some dev dependencies. If you only have the production packages installed, also install the dev dependencies.
###### Install Development Dependencies
```bash
npm install --only=dev
```
###### Run Test
```bash
# You can use mocha globally if you please
# Make sure you're in the repo's root dir or change the paths
$ node ./node_modules/mocha/bin/mocha ./test/manual/devices.js
```
###### Example Output
The test shows you a markdown compatible table, a standard mocha test tree where you can respond with a [y]es or [n]o (defaults to the capital letter response), and shows you your answers as passes or failures. The answers are purely so a tester can keep track of the results and doesn't perform any different code.
```
Current Devices:

| Port   | Number | Name                         | Supported |
| ------ | ------ | ---------------------------- | --------- |
| input  | 0      | 6- Launchpad MK2             | true      |
| output | 0      | Microsoft GS Wavetable Synth | false     |
| output | 1      | 6- Launchpad MK2             | true      |


  devices
? Do you see all of your expected devices and their ports in the table? Yes
	√ should output all of your devices' ports
? Do you see all of your expected devices shown as supported? Yes
	√ should show support for all supported devices


	2 passing (4s)
```


## Constructing Your Launchpad
- Try adding port numbers to your device's construction in case Rocketry doesn't recognize your device or it mistakenly recognizes another
- Check if your device is supported by [Checking Device Information](#checking-device-information)
	- Check for updates or if it's unsupported
