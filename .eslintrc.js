module.exports = {
	"env": {
		"es6": true,
		"node": true
	},
	"plugins": ["node"],
	"extends": ["eslint:recommended", "plugin:node/recommended"],
	"parserOptions": {
		"sourceType": "module"
	},
	"rules": {
		"indent": [
			"error",
			"tab",
			{
				"SwitchCase": 1
			}
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"warn",
			"double"
		],
		"semi": [
			"error",
			"always"
		],
		"no-var": [
			"error"
		],
		"no-console": [
			"warn"
		],
		"object-shorthand": [
			"warn",
			"always"
		],
		"no-throw-literal": [
			"error"
		],
		"quote-props": [
			"warn",
			"as-needed",
			{
				"unnecessary": false,
				"numbers": true
			}
		],
		"no-fallthrough": [
			"error",
			{
				"commentPattern": "falls?\\s?through|break"
			}
		],
		"strict": [
			"error",
			"global"
		]
	},
	"overrides": [
		// Mocha tests
		{
			"files": [
				"test/*.js"
			],
			"env": {
				"es6": true,
				"node": true,
				"mocha": true
			},
			"plugins": [
				"mocha"
			],
			"rules": {
				"mocha/handle-done-callback": "error",
				"mocha/no-exclusive-tests": "error",
				"mocha/no-global-tests": "warn",
				"mocha/no-hooks-for-single-case": "warn",
				"mocha/no-identical-title": "error",
				"mocha/no-mocha-arrows": "warn",
				"mocha/no-nested-tests": "error",
				"mocha/no-pending-tests": "warn",
				"mocha/no-return-and-callback": "error",
				"mocha/no-sibling-hooks": "error",
				"mocha/no-skipped-tests": "warn",
				"mocha/no-top-level-hooks": "error",
				// Allow for dev dependencies
				"node/no-unpublished-require": "off",
				// Shorthand isn't helpful when making stubs
				"object-shorthand": "off"
			}
		}
	]
};
