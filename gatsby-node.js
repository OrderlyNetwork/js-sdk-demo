exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        buffer: require.resolve("buffer/"),
      },
    },
  });
};
