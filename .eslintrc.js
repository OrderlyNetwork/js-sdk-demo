module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: ['eslint:recommended', 'plugin:react/recommended', 'airbnb', 'prettier'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 12,
		sourceType: 'module',
	},
	globals: {
		JSX: true,
	},
	plugins: ['react', 'fp', '@typescript-eslint', 'prettier'],
	settings: {
		'import/resolver': {
			node: {
				extensions: ['.js', '.jsx', '.ts', '.tsx'],
				paths: ['src'],
			},
		},
	},
	rules: {
		'fp/no-let': 'warn',
		'fp/no-class': 'error',
		'fp/no-get-set': 'error',
		'fp/no-this': 'error',
		'prettier/prettier': 'error',
		'no-shadow': 'off',
		'camelcase': 'off',
		'react/jsx-props-no-spreading': 'off',
		'react/function-component-definition': 'off',
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': ['warn'],
		'no-use-before-define': 'off',
		'@typescript-eslint/no-use-before-define': ['off'],
		'react/react-in-jsx-scope': 'off',
		'react/prop-types': 'off',
		'react/require-default-props': 'off',
		'import/prefer-default-export': 'off',
		'react/jsx-no-bind': 'off',
		'jsx-a11y/click-events-have-key-events': ['off'],
		'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
		'import/extensions': 'off',
		'no-param-reassign': ['error', { props: false }],
		'arrow-body-style': 'off',
		'jsx-a11y/no-static-element-interactions': ['off'],

		'no-console': ['warn', { allow: ['warn', 'error'] }],

		'no-restricted-syntax': [
			'warn',
			{
				selector: 'ForStatement',
				message: 'For and while are not allowed, use immutable iteration methods',
			},
			{
				selector: 'WhileStatement',
				message: 'For and while are not allowed, use immutable iteration methods',
			},
			{
				selector: 'DoWhileStatement',
				message: 'For and while are not allowed, use immutable iteration methods',
			},
			{
				selector: 'FunctionExpression',
				message: 'Function expressions are not allowed, use function declaration instead',
			},
			{
				selector: 'ExportDefaultDeclaration',
				message: 'Default exports restricted, use only named exports',
			},
		],
	},
	overrides: [
		{
			files: ['*.ts', '*.tsx'],
			rules: {
				'no-undef': 'off',
			},
		},
	],
};
