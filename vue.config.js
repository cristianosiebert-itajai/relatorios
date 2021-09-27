const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  configureWebpack: {
    plugins: [
      new MomentLocalesPlugin({localesToKeep:['en','pt-br']}),
      new BundleAnalyzerPlugin()
    ]
  }
}
