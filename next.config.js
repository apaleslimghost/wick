const {IgnorePlugin} = require('webpack');

module.exports = {
  webpack: (config, { dev }) => {
    config.plugins.push(new IgnorePlugin(/superlogin/));
    return config
  },
};
