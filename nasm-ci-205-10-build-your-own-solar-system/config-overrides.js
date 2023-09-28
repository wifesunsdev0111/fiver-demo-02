const path = require('path');
const rewireReactHotLoader = require('react-app-rewire-hot-loader');
const rewireStyledComponents = require('react-app-rewire-styled-components');

module.exports = {
  webpack: (config, env) => {
    config = rewireReactHotLoader(config, env);

    const reactDOM =
      env === 'development' ? { 'react-dom': '@hot-loader/react-dom' } : {};

    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve('src'),
      ...reactDOM,
    };

    // generated class names includes the components' name
    if (env === 'development') {
      config = rewireStyledComponents(config, env);
    }

    return config;
  },
};
