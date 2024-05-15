const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const react = require('react');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  config.resolve = {
    ...config.resolve,
    alias:{
      ...config.resolve.alias,
      react: path.resolve(__dirname, "./node_modules/react"),
    }
  };

  return config;
};
