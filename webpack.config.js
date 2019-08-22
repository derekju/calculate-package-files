const webpack = require('webpack');

module.exports = {
  mode: 'production',
  target: 'node',
  output: {
    filename: 'calculate-package-files.js'
  },
  plugins: [
    new webpack.BannerPlugin('Usage: node calculate-package-files.js <...lockfiles>')
  ]
};
