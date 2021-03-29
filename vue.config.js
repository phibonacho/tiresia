const webpack = require("webpack");
module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/tiresia/'
    : '',
  pwa: {
    themeColor: '#1b214b'
  },
  configureWebpack: config => ({
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          PACKAGE_VERSION: JSON.stringify(require('./package.json').version)
        }
      })
    ]
  })
}
