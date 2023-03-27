exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
	actions.setWebpackConfig({
		resolve: {
			fallback: {
				buffer: require.resolve('buffer/'),
			},
			// alias: {
			// 	'orderly-sdk': require.resolve('./static/orderly_sdk'),
			// 	'orderly-sdk/lib/enums': require.resolve('./static/orderly_sdk/enums'),
			// },
		},
	});
};
