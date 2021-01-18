module.exports = {
	"plugins": [
		"evelyn",
	],
	"extends": [
		"plugin:evelyn/default",
		"plugin:evelyn/node",
		"plugin:evelyn/source",
	],
	"ignorePatterns": [
		"lib",
		"coverage",
	],
	"overrides": [
		{
			"files": [
				"**/*.ts",
			],
			"parserOptions": {
				"project": "./tsconfig.json",
			},
			"extends": [
				"plugin:evelyn/typescript",
			],
		},
	],
};
