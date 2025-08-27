module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const oneOfRule = webpackConfig.module.rules.find(r => r.oneOf).oneOf;
      oneOfRule.forEach((rule) => {
        if (rule.use) {
          rule.use.forEach((loader) => {
            if (loader.loader && loader.loader.includes('sass-loader')) {
              // force using our top-level sass
              loader.options.implementation = require('sass');
            }
          });
        }
      });
      return webpackConfig;
    },
  },
  devServer: (devServerConfig) => {
    devServerConfig.setupMiddlewares = (middlewares, devServer) => {
      // your custom middleware here, replacing the deprecated options
      return middlewares;
    };
    delete devServerConfig.onBeforeSetupMiddleware;
    delete devServerConfig.onAfterSetupMiddleware;
    return devServerConfig;
  },
};