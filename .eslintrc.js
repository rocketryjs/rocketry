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
			"parser": "@typescript-eslint/parser",

			"parserOptions": {
				"project": "./tsconfig.json",
			},
			"plugins": [
				"@typescript-eslint",
			],
			"extends": [
				"plugin:@typescript-eslint/eslint-recommended",
				"plugin:@typescript-eslint/recommended",
			// 	"plugin:evelyn/typescript",
			],
		},
	],
};
