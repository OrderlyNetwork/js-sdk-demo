exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
	actions.setWebpackConfig({
		resolve: {
			fallback: {
				buffer: require.resolve('buffer/'),
			},
			alias: {
				'@/service/orderlyService': require.resolve('./static/orderly_sdk'),
			},
		},
	});
};
