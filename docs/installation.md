# Installation
## Installing Node.JS
[Download](https://nodejs.org/en/download/) and run the latest or last LTS version of Node.js. [`nvm`](https://nodejs.org/en/download/package-manager/#nvm) or [another package manager](https://nodejs.org/en/download/package-manager/) may be helpful.

###### Checking Your version
```bash
# You can find the suggested minimum version of node in package.json > engines > node
$ node -v
# Make sure you also installed npm with your node install
$ npm -v
```

## Installing the Module
###### From npm
```bash
$ npm install launchpad-rocket
```
###### As a dependency
```bash
# Create package.json for your own module if you haven't already
$ npm init

# Install Rocket and add to dependencies
$ npm install launchpad-rocket --save
```
###### From source
```bash
$ git clone https://github.com/evelynhathaway/launchpad-rocket
$ cd launchpad-rocket/
$ npm install
```


## Troubleshooting
See [Troubleshooting - Installation](troubleshooting.md#installation)
