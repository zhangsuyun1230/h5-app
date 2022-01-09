const webpack = require("webpack");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const path = require('path')
const port = '8080'

module.exports = {
  publicPath: './',
  configureWebpack:{
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new BundleAnalyzerPlugin()
    ],
    resolve: {
      alias: {
        '@': path.resolve('src'),
      }
    }
  },
  // chainWebpack: config => {
  //   config.resolve.alias
  //   .set('./patchers', path.resolve(__dirname, 'src/assets/patchers.js'))
  // },
  devServer: {
    port,
    open: false,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      "/app": {
        target: "http://61.177.139.106:28001/", // process.env.VUE_APP_URL,
        changeOrigin: true, // 是否改变域名
        ws: true,
        // pathRewrite: {} // 路径重写
      },
      //webSocket代理
      // '/socket': {
      //   target: 'ws://你的服务器地址/parkingServer',
      //   ws: true,//开启ws, 如果是http代理此处可以不用设置
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/socket': '/'
      //   }
      // }
    }
  }
}