// vue.config.js
module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/kg-hub-dashboard/'
    : '/',
  chainWebpack: (config) => {
    config.module
      .rule('markdown')
      .test(/\.md$/)
      .use('vue-loader')
      .end()
      .use('vmark-loader')
      .loader('vmark-loader')
      .end();
  },
  lintOnSave: false,
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'KG-Hub Dashboard',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
  }
};
