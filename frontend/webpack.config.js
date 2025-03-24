const webpack = require('webpack');

module.exports = {
  // ...existing code...
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env), // Inject process.env
    }),
  ],
};