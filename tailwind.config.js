/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors');

module.exports = {
	content: [
		'./src/pages/**/*.{js,jsx,ts,tsx}',
		'./src/components/**/*.{js,jsx,ts,tsx}',
	],
	theme: {
		extend: {
			colors: {
				// 'primary': colors.gray.DEFAULT,
				'primary': colors.blue['600'],
				'secondary': '#ecc94b',
				'trade-green': {
					light: '',
					DEFAULT: 'rgba(var(--color-trade-green), <alpha-value>)',
					dark: '',
				},
				'trade-red': {
					light: '',
					DEFAULT: 'rgba(var(--color-trade-red), <alpha-value>)',
					dark: '',
				},

				// ""
				'current': 'currentColor',
			},
		},
	},
	plugins: [],
};
