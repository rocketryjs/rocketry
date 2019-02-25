# Installation
## Installing Node.JS
[Download](https://nodejs.org/en/download/) and run the latest or last LTS version of Node.js. [`nvm`](https://nodejs.org/en/download/package-manager/#nvm) or [another package manager](https://nodejs.org/en/download/package-manager/) may be helpful.

### Checking Your version

```bash
# You can find the suggested minimum version of node in package.json > engines > node
node -v
# Make sure you also installed npm with your node install
npm -v
```

## Installing the Module

npm may warn you about using a Node.js version that's too low for Rocketry. The suggested version of Node.js set in the `package.json` is set rather high because of the use of `async`/`await` in tests. If you don't intend to run tests, it will most likely work on `v6.x.x`, but it's not supported at this time.

### From npm

```bash
npm install @rocketry/core
```

### From source

```bash
git clone https://github.com/rocketryjs/rocketry
cd rocketry/
npm install
```

## Troubleshooting

See [Troubleshooting - Installation](troubleshooting.md#installation)
